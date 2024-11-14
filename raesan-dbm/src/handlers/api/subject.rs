// imports
use crate::core;
use axum::{self, response::IntoResponse};
use diesel::prelude::*;
use raesan_common::schema;
use std::sync::{Arc, RwLock};
use time;
use uuid;

// POST (/api/subject) route handler
pub async fn create_subject_route(
    axum::extract::State(app_state): axum::extract::State<Arc<RwLock<core::app::Application>>>,
    axum::extract::Json(json): axum::extract::Json<core::models::Subject>,
) -> Result<axum::response::Response, (axum::http::StatusCode, String)> {
    let mut input_data = json.clone();
    // database connection
    let mut conn = match match app_state.write() {
        Ok(safe_app_state) => safe_app_state,
        Err(e) => {
            println!("Failed to get application state, Error {:#?}", e);
            return Err((
                axum::http::StatusCode::INTERNAL_SERVER_ERROR,
                String::from("Failed to get application state"),
            ));
        }
    }
    .database
    .pool
    .get()
    {
        Ok(safe_conn) => safe_conn,
        Err(e) => {
            println!("Failed to get database connection, Error {:#?}", e);
            return Err((
                axum::http::StatusCode::INTERNAL_SERVER_ERROR,
                String::from("Failed to get database connection"),
            ));
        }
    };

    input_data.id = uuid::Uuid::new_v4().to_string();
    input_data.created_at = time::OffsetDateTime::now_utc().unix_timestamp();
    input_data.updated_at = time::OffsetDateTime::now_utc().unix_timestamp();
    let results: core::models::Subject = diesel::insert_into(schema::subjects::dsl::subjects)
        .values(input_data)
        .get_result(&mut conn)
        .unwrap();

    return Ok((
        [(
            axum::http::header::CONTENT_TYPE,
            String::from("text/html; charset=utf-8"),
        )],
        axum::Json(results),
    )
        .into_response());
}

// POST (/api/subject/json) route handler
pub async fn json_to_subject_route(
    axum::extract::State(app_state): axum::extract::State<Arc<RwLock<core::app::Application>>>,
    axum::extract::Json(json): axum::extract::Json<Vec<core::models::Subject>>,
) -> Result<axum::response::Response, (axum::http::StatusCode, String)> {
    let mut input_data = json.clone();
    // database connection
    let mut conn = match match app_state.write() {
        Ok(safe_app_state) => safe_app_state,
        Err(e) => {
            println!("Failed to get application state, Error {:#?}", e);
            return Err((
                axum::http::StatusCode::INTERNAL_SERVER_ERROR,
                String::from("Failed to get application state"),
            ));
        }
    }
    .database
    .pool
    .get()
    {
        Ok(safe_conn) => safe_conn,
        Err(e) => {
            println!("Failed to get database connection, Error {:#?}", e);
            return Err((
                axum::http::StatusCode::INTERNAL_SERVER_ERROR,
                String::from("Failed to get database connection"),
            ));
        }
    };

    for element in input_data.iter_mut() {
        let curr_class: core::models::Class = match schema::classes::dsl::classes
            .filter(schema::classes::name.eq(element.class_name.clone()))
            .select(core::models::Class::as_select())
            .first(&mut conn)
        {
            Ok(safe_results) => safe_results,
            Err(e) => {
                println!("Failed to validate records from JSON data, Error {:#?}", e);
                return Err((
                    axum::http::StatusCode::BAD_REQUEST,
                    String::from("Failed to validate records from JSON data"),
                ));
            }
        };
        element.id = uuid::Uuid::new_v4().to_string();
        element.class_id = curr_class.id;
        element.created_at = time::OffsetDateTime::now_utc().unix_timestamp();
        element.updated_at = time::OffsetDateTime::now_utc().unix_timestamp();
    }
    let mut new_records: Vec<core::models::Subject> = Vec::new();
    input_data.iter().for_each(|element| {
        new_records.push(
            diesel::insert_into(schema::subjects::dsl::subjects)
                .values(element)
                .get_result(&mut conn)
                .unwrap(),
        );
    });
    return Ok((
        [(
            axum::http::header::CONTENT_TYPE,
            String::from("text/html; charset=utf-8"),
        )],
        axum::Json(new_records),
    )
        .into_response());
}

// DELETE (/api/subject/:subject_id) route handler
pub async fn delete_subject_route(
    axum::extract::State(app_state): axum::extract::State<Arc<RwLock<core::app::Application>>>,
    axum::extract::Path(subject_id): axum::extract::Path<String>,
) -> Result<axum::response::Response, (axum::http::StatusCode, String)> {
    // database connection
    let mut conn = match match app_state.write() {
        Ok(safe_app_state) => safe_app_state,
        Err(e) => {
            println!("Failed to get application state, Error {:#?}", e);
            return Err((
                axum::http::StatusCode::INTERNAL_SERVER_ERROR,
                String::from("Failed to get application state"),
            ));
        }
    }
    .database
    .pool
    .get()
    {
        Ok(safe_conn) => safe_conn,
        Err(e) => {
            println!("Failed to get database connection, Error {:#?}", e);
            return Err((
                axum::http::StatusCode::INTERNAL_SERVER_ERROR,
                String::from("Failed to get database connection"),
            ));
        }
    };

    // delete the subject
    diesel::delete(
        schema::subjects::dsl::subjects.filter(schema::subjects::dsl::id.eq(subject_id)),
    )
    .execute(&mut conn)
    .unwrap();

    return Ok((
        [(
            axum::http::header::CONTENT_TYPE,
            String::from("text/html; charset=utf-8"),
        )],
        String::from("DELETE SUBJECT"),
    )
        .into_response());
}

// PATCH (/api/subject) route handler
pub async fn update_subject_route(
    axum::extract::State(app_state): axum::extract::State<Arc<RwLock<core::app::Application>>>,
    axum::extract::Json(json): axum::extract::Json<core::models::Subject>,
) -> Result<axum::response::Response, (axum::http::StatusCode, String)> {
    // database connection
    let mut conn = match match app_state.write() {
        Ok(safe_app_state) => safe_app_state,
        Err(e) => {
            println!("Failed to get application state, Error {:#?}", e);
            return Err((
                axum::http::StatusCode::INTERNAL_SERVER_ERROR,
                String::from("Failed to get application state"),
            ));
        }
    }
    .database
    .pool
    .get()
    {
        Ok(safe_conn) => safe_conn,
        Err(e) => {
            println!("Failed to get database connection, Error {:#?}", e);
            return Err((
                axum::http::StatusCode::INTERNAL_SERVER_ERROR,
                String::from("Failed to get database connection"),
            ));
        }
    };

    let mut input_data = json.clone();
    input_data.updated_at = time::OffsetDateTime::now_utc().unix_timestamp();
    let result: core::models::Subject = input_data.save_changes(&mut conn).unwrap();

    return Ok((
        [(
            axum::http::header::CONTENT_TYPE,
            String::from("text/html; charset=utf-8"),
        )],
        axum::Json(result),
    )
        .into_response());
}

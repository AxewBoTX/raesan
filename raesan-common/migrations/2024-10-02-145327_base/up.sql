CREATE TABLE class(
	id TEXT PRIMARY KEY NOT NULL,
	name INTEGER UNIQUE NOT NULL
);

CREATE TABLE subject(
	id TEXT PRIMARY KEY NOT NULL,
	name TEXT NOT NULL,
	class_id TEXT NOT NULL,
	class_name INTEGER NOT NULL,
	FOREIGN KEY  (class_id) REFERENCES class(id) ON DELETE CASCADE
);

CREATE TABLE chapter(
	id TEXT PRIMARY KEY NOT NULL,
	name TEXT NOT NULL,
	subject_id TEXT NOT NULL,
	subject_name TEXT NOT NULL,
	class_name INTEGER NOT NULL,
	FOREIGN KEY  (subject_id) REFERENCES subject(id) ON DELETE CASCADE
);

CREATE TABLE question(
	id TEXT PRIMARY KEY NOT NULL,
	body TEXT UNIQUE NOT NULL,
	chapter_id TEXT NOT NULL,
	FOREIGN KEY  (chapter_id) REFERENCES chapter(id) ON DELETE CASCADE
);

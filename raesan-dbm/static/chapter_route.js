// handle create_chapter_form submition
const handleCreateChapterFormSubmit = () => {
  let create_chapter_form = document.getElementById("create_chapter_form");
  if (
    (create_chapter_form.elements["name"].value.trim() === "" &&
      create_chapter_form.elements["name"].value.trim().length === 0) ||
    (create_chapter_form.elements["subject_id"].value.trim() === "" &&
      create_chapter_form.elements["subject_id"].value.trim().length === 0) ||
    (create_chapter_form.elements["subject_name"].value.trim() === "" &&
      create_chapter_form.elements["subject_name"].value.trim().length === 0) ||
    (create_chapter_form.elements["class_name"].value.trim() === "" &&
      create_chapter_form.elements["chapter_name"].value.trim().length === 0)
  ) {
    alert("You cannot leave things empty!");
  } else {
    fetch("/api/chapter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: "",
        name: create_chapter_form.elements["name"].value,
        subject_id: create_chapter_form.elements["subject_id"].value,
        subject_name: create_chapter_form.elements["subject_name"].value,
        class_name: parseInt(create_chapter_form.elements["class_name"].value),
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (document.getElementById("create_chapter_modal")) {
          document.getElementById("create_chapter_modal").close();
        }
      });
  }
};

// handle create_chapter_from_json_input submition
document.getElementById("create_chapter_from_json_input").value = "";
const handleCreateChapterFromJsonFormSubmit = () => {
  let create_chapter_from_json_input = document.getElementById(
    "create_chapter_from_json_input",
  );
  if (
    create_chapter_from_json_input.value.trim() === "" &&
    create_chapter_from_json_input.value.trim().length === 0
  ) {
    alert("Atleast enter something!");
  } else {
    fetch("/api/chapter/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        JSON.parse(create_chapter_from_json_input.value),
      ).trim(),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (document.getElementById("create_chapter_from_json_modal")) {
          document.getElementById("create_chapter_from_json_modal").close();
        }
      });
  }
};

// delete chapter handler
const deleteChapter = (chapter_id, chapter_name) => {
  let choice = confirm(`WARNING! Do you want to delete '${chapter_name}'`);
  if (choice == true) {
    fetch(`/api/chapter/${chapter_id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.text();
      })
      .then((data) => {
        document.getElementById(chapter_id).remove();
      });
  }
};

// edit chapter handler
const editChapter = (chapter_id) => {
  let chapter = chapter_list.find((ch) => ch.id == chapter_id);
  if (chapter) {
    let chapter_row = document.getElementById(chapter.id);
    if (chapter_row) {
      chapter_row.innerHTML = `
				<td class="whitespace-nowrap">${chapter.id}</td>
				<td id="name" class="whitespace-nowrap"><input type="text" placeholder="Name" value="${chapter.name}" class="input input-bordered w-full max-w-xs min-w-[60px]"/></td>
				<td id="subject_name" class="whitespace-nowrap"><input type="text" placeholder="Subject" value="${chapter.subject_name}" class="input input-bordered w-full max-w-xs min-w-[60px]"/></td>
				<td id="class_name" class="whitespace-nowrap"><input type="number" placeholder="Class" value="${chapter.class_name}" class="input input-bordered w-full max-w-xs min-w-[60px]"/></td>
				<th>
					<div class="join">
					  <button
						class="btn btn-sm btn-outline btn-successfull join-item"
						onclick="updateChapter(JSON.parse(decodeURIComponent('${encodeURIComponent(JSON.stringify(chapter))}')))"
					  >
					 Save
					  </button>
					  <button
						class="btn btn-sm btn-outline btn-error join-item"
						onclick="resetChapter(JSON.parse(decodeURIComponent('${encodeURIComponent(JSON.stringify(chapter))}')))"
					  >
					  Reset
					  </button>
					</div>
				</th>
				`;
    }
  } else {
    alert("Something went wrong!");
  }
};

// update chapter handler
const updateChapter = (chapter) => {
  const chapter_row = document.getElementById(chapter.id);
  let new_chapter = {
    id: chapter.id,
    name: chapter_row.querySelector("#name input").value,
    subject_id: "",
    subject_name: chapter_row.querySelector("#subject_name input").value,
    class_name: parseInt(chapter_row.querySelector("#class_name input").value),
  };
  chapter.subject_id = "";
  // use `loadash` to compare structs
  if (_.isEqual(new_chapter, chapter)) {
    resetChapter(chapter);
  } else {
    fetch("/api/chapter", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(new_chapter).trim(),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // update the chapter in the chapter_list
        const index = chapter_list.findIndex((ch) => ch.id === data.id);
        if (index !== -1) {
          chapter_list[index] = { ...data };
        } else {
          alert("Something went Terribly Wrong!");
        }
        resetChapter(data);
      })
      .catch((err) => {
        resetChapter(chapter);
        alert("Failed to update the Chapter");
        throw new Error(`HTTP error! Status: ${res.status}`);
      });
  }
};

// reset chapter handler
const resetChapter = (chapter) => {
  document.getElementById(chapter.id).innerHTML = `
		<td class="whitespace-nowrap">${chapter.id}</td>
		<td class="whitespace-nowrap">${chapter.name}</td>
		<td class="whitespace-nowrap">${chapter.subject_name}</td>
		<td class="whitespace-nowrap">${chapter.class_name}</td>
		<th>
			<div class="join">
			  <button
				class="btn btn-sm btn-outline btn-secondary join-item"
				onclick="editChapter('${chapter.id}')"
			  >
			  <span class="iconify mdi--edit-outline w-[22px] h-[22px]"></span>
			  </button>
			  <button
				class="btn btn-sm btn-outline btn-accent join-item"
				onclick="deleteChapter('${chapter.id}','${chapter.name}')"
			  >
			  <span class="iconify mdi--bin-outline w-[22px] h-[22px]"></span>
			  </button>
			</div>
		</th>
		`;
};

let curr_page = 1;
// Function to fetch and append new data
function fetchAndAppendData() {
  let chapter_table_body = document.getElementById("chapter_table_body");
  curr_page += 1;

  fetch(`/api/chapter?page=${curr_page}`, { method: "GET" })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.length === 0) {
        // If no more data, stop observing
        observer.disconnect();
        return;
      }

      // Append the new data to the table body
      data.forEach((element) => {
        chapter_list.push(element); // push the element to the chapter list
        chapter_table_body.innerHTML += `
					<tr id="${element.id}">
						<td class="whitespace-nowrap">${element.id}</td>
						<td class="whitespace-nowrap">${element.name}</td>
						<td class="whitespace-nowrap">${element.subject_name}</td>
						<td class="whitespace-nowrap">${element.class_name}</td>
						<th>
							<div class="join">
							  <button
								class="btn btn-sm btn-outline btn-secondary join-item"
								onclick="editChapter('${element.id}')"
							  >
							  <span class="iconify mdi--edit-outline w-[22px] h-[22px]"></span>
							  </button>
							  <button
								class="btn btn-sm btn-outline btn-accent join-item"
								onclick="deleteChapter('${element.id}','${element.name}')"
							  >
							  <span class="iconify mdi--bin-outline w-[22px] h-[22px]"></span>
							  </button>
							</div>
						</th>
					</tr>
					`;
      });

      // Update the observer to observe the new last element
      const newLastElement = chapter_table_body.lastElementChild;
      if (newLastElement) {
        observer.observe(newLastElement);
      }
    })
    .catch((err) => {
      console.error("Failed to fetch data:", err);
    });
}

// IntersectionObserver to load more data when the last element is visible
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Stop observing the current element
        observer.unobserve(entry.target);
        // Fetch and append new data
        fetchAndAppendData();
      }
    });
  },
  {
    threshold: 0.1, // when at least 10% of the element is visible
  },
);

// Start observing when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const initialLastElement =
    document.getElementById("chapter_table_body").lastElementChild;
  if (initialLastElement) {
    observer.observe(initialLastElement);
  }
});

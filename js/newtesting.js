document.addEventListener("DOMContentLoaded", function () {

    console.log("Hit newtesting ===============================================");
    fetchUserData();
    getGroups();

    function fetchUserData() {
        fetch("http://localhost:8080/Newtesting/getAllUserInformation/"+document.cookie)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("API Response:", data); // Debugging log

                if (data.sessionState === "ok") {
                    populateUserTable(data.employees);
                } else {
                    alert("Failed to fetch user data.");
                }
            })
            .catch(error => console.error("Error fetching user data:", error));
    }



    
    function populateUserTable(users) {
        const userTableBody = document.getElementById("userTableBody");
        if (!userTableBody) {
            console.error("userTableBody element not found");
            return;
        }

        userTableBody.innerHTML = ""; // Clear existing rows

        users.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <div class="hide" >${user.id}</div>
                <td><input type="checkbox" class="user-checkbox" value="${user.id}"></td>
                <td>${user.employeeInfoNumber}</td>
                <td>
                    <div style="display: flex; align-items: center;">
                        ${user.employeeInfoProfileImage ? `<img src="${user.employeeInfoProfileImage}" alt="Profile" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">` : ""}
                        ${user.employeeInfoUserName} ${user.employeeInfoLastName}
                    </div>
                </td>
                <td>${user.employeeInfoSkills && user.employeeInfoSkills.length > 0 ? user.employeeInfoSkills.join(", ") : "No skills added"}</td>
                <td>${user.employeeInfoGroup || "-"}</td>
                <td>${user.employeeInfoStatus || "-"}</td>
                <td>
                    <div class="action-icons">
                        <a href="${user.employeeInfoCV ? `http://localhost:8080/Newtesting/viewCv/${user.id}` : '#'}" target="_blank"><i class="fas fa-eye"></i></a>
                        <a href="#" class="delete-icon" data-id="${user.id}"><i class="fas fa-trash"></i></a>
                        <a href="#" class="message-icon" data-id="${user.id}"><i class="fas fa-envelope"></i></a>
                    </div>
                </td>
            `;
            userTableBody.appendChild(row);
        });

        for( i = 0 ; i < document.getElementsByClassName("hide").length ; i++  ){
            document.getElementsByClassName("hide")[i].style.display = "none"
        }

        console.log("User data successfully populated"); // Debugging log
        attachEventListeners(); // Attach event listeners after populating table
    }

    

    // Fetch users with filters
    function fetchFilteredUserData(searchSkill = "", filterGroup = "") {
        const url = `http://localhost:8080/Newtesting/getAllUserInformationWithFilters/${document.cookie}?searchSkill=${encodeURIComponent(searchSkill)}&filterGroup=${encodeURIComponent(filterGroup)}`;
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                console.log("Filtered API Response:", data);
                if (data.sessionState === "ok") {
                    populateUserTable(data.employees.map(emp => ({
                        employeeInfoNumber: emp.id,
                        employeeInfoUserName: emp.employeeInfoFullName.split(" ")[0],
                        employeeInfoLastName: emp.employeeInfoFullName.split(" ").slice(1).join(" "),
                        employeeInfoSkills: emp.employeeInfoSkills ? emp.employeeInfoSkills.split(", ") : [],
                        employeeInfoGroup: emp.employeeInfoGroup,
                        employeeInfoStatus: emp.employeeInfoStatus,
                        employeeInfoProfileImage: emp.employeeInfoProfileImage,
                        employeeInfoCV: emp.employeeInfoCV
                    })));
                } else {
                    alert("Failed to fetch filtered user data.");
                }
            })
            .catch(error => console.error("Error fetching filtered user data:", error));
    }

    

    // Attach event listeners for interactivity
    function attachEventListeners() {
        // Filter form submission
        document.querySelector("#filterForm").addEventListener("submit", function (e) {
            e.preventDefault();
            const searchSkill = document.getElementById("searchSkill").value;
            const filterGroup = document.getElementById("filterGroup").value;
            fetchFilteredUserData(searchSkill, filterGroup);
        });

        // Select all checkbox
        document.getElementById("selectAll").addEventListener("change", function () {
            document.querySelectorAll(".user-checkbox").forEach(cb => cb.checked = this.checked);
            toggleActions();
        });

        // Individual checkboxes
        document.querySelectorAll(".user-checkbox").forEach(cb => {
            cb.addEventListener("change", toggleActions);
        });


        // CSV download
        document.querySelector('button[name="download_csv"]').addEventListener("click", function () {
            const selectedIds = Array.from(document.querySelectorAll(".user-checkbox:checked")).map(cb => cb.value);
            if (selectedIds.length > 0) {
                fetch("http://localhost:8080/Newtesting/downloadCsv", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(selectedIds)
                })
                .then(response => {
                    if (!response.ok) throw new Error("Failed to download CSV");
                    return response.blob();
                })
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "users.csv";
                    a.click();
                })
                .catch(error => console.error("Error downloading CSV:", error));
            } else {
                alert("Please select at least one user.");
            }
        });
        

        // Delete action
        document.querySelectorAll(".delete-icon").forEach(icon => {
            icon.addEventListener("click", function (e) {
                e.preventDefault();
                const id = this.getAttribute("data-id");
                if (confirm("Are you sure you want to delete this user?")) {
                    fetch(`http://localhost:8080/Newtesting/delete/${id}`, { method: "DELETE" })
                        .then(response => {
                            if (response.ok) {
                                fetchUserData(); // Refresh table after deletion
                            } else {
                                alert("Failed to delete user.");
                            }
                        })
                        .catch(error => console.error("Error deleting user:", error));
                }
            });
        });

        // Message popup functionality
        document.querySelectorAll(".message-icon").forEach(icon => {
            icon.addEventListener("click", function (e) {
                e.preventDefault();
                const id = this.getAttribute("data-id");
                document.getElementById("messagePopup").style.display = "block";
                document.getElementById("sendMessageBtn").setAttribute("data-id", id);
            });
        });

        document.querySelector(".close-btn").addEventListener("click", function () {
            document.getElementById("messagePopup").style.display = "none";
        });

        document.getElementById("sendMessageBtn").addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            const message = document.getElementById("messageContent").value.trim();
            if (message) {
                fetch(`http://localhost:8080/Newtesting/submitFeedback?employeeId=${id}&feedback=${encodeURIComponent(message)}`, {
                    method: "POST"
                })
                .then(response => {
                    if (response.ok) {
                        alert("Message sent!");
                        document.getElementById("messagePopup").style.display = "none";
                        document.getElementById("messageContent").value = "";
                    } else {
                        alert("Failed to send message.");
                    }
                })
                .catch(error => console.error("Error sending feedback:", error));
            } else {
                alert("Message cannot be empty.");
            }
        });

        document.getElementById("deleteSession").addEventListener('click', async function(params) {
            console.log("Hell is coming");
            document.cookie = "fail";
        
            window.location.href = "file:///C:/Users/mphut/Desktop/skillManagmentSystem/frontend/index.html";
        });
    }

    // Toggle visibility of actions div
    function toggleActions() {
        const anyChecked = document.querySelectorAll(".user-checkbox:checked").length > 0;
        document.querySelector(".actions").style.display = anyChecked ? "block" : "none";
    }

    async function getGroups(){

        console.log("Get groups")
    
        respose = await fetch('http://localhost:8080/getGroups')
        .then(res => res.json())
        .then(data => {
    
            console.log("Recevied groups===============================");
            console.log(data);
    
            if(data.groups != null && data.groups.length > 0){
    
                let element = document.getElementById("filterGroup");
    
                data.groups.forEach( dataItem => {
                    const option = document.createElement('option');
                    option.value = dataItem;
                    option.textContent = dataItem;
                    element.appendChild(option)
                });
            }
        });
    }
});
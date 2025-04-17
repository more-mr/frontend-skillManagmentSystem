checkSession()
getProfileInformation()

function confirmAndDelete(catagoryType) {
    let selectedItem = '';
    let url = 'Viewprofile.php?delete=';

    if (catagoryType === 'skill') {
        selectedItem = document.getElementById('skillDropdown').value;
    } else if (catagoryType === 'cv') {
        selectedItem = document.getElementById('cvDropdown').value;
    }

    if (!selectedItem) {
        alert('Please select an item to delete.');
        return;
    }

    const confirmation = confirm(`Are you sure you want to delete this ${catagoryType}?`);

    if (confirmation) {

        console.log(catagoryType+"=====================================================");
        console.log(selectedItem+"=====================================================");


        fetch('http://localhost:8080/Viewprofile/confirmAndDeleteItem/'+document.cookie , {
            method: 'POST',
            body: JSON.stringify(
                {
                    type : catagoryType,
                    itemName : selectedItem
                }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => res.json())
          .then(data => {
            console.log(data)
            window.location.href = "file:///C:/Users/mphut/Desktop/skillManagmentSystem/frontend/Viewprofile.html";
        })
    }
}

function logout() {

    console.log("Hell is coming");
    document.cookie = "fail";
    window.location.href = "file:///C:/Users/mphut/Desktop/skillManagmentSystem/frontend/index.html";
}

function toggleNotificationPopup() {
    const popup = document.getElementById('notificationPopup');
    popup.classList.toggle('active');
}


async function getProfileInformation() {

    console.log("in GOT PROFILE INFROMATION")

    respose = await fetch('http://localhost:8080/Viewprofile/getProfileInformation/'+document.cookie )
    .then(res => res.json())
    .then(data => {

        console.log("===============================Got user info");
        console.log(document.cookie);

        if(data.sessionState === "ok"){

            console.log(data);
            console.log(data.employeeInfoNumber);

            document.getElementById("number").innerText = " " + data.employeeInfoNumber;
            document.getElementById("firstName").innerText = data.employeeInfoUserName + " " + data.employeeInfoLastName;
            document.getElementsByClassName("profile-pic")[0].style.backgroundImage = "url(http://localhost:8080/Viewprofile/getProfilePicture/"+document.cookie+")"//MAKE ANOTHER API CALL

            document.getElementById("notificationCount").innerText = data.employeeInfoNotification != null ? data.employeeInfoNotification.length : "0" ;


            if(data.employeeInfoCV != null){

                document.getElementById("cvDropdown").innerHTML += "<option value="+data.employeeInfoCV+">"+data.employeeInfoCV+"</option>";
            }


            if(data.employeeInfoNotification != null && data.employeeInfoNotification.length > 0){

                let element = document.getElementById("notificationContent");
                data.employeeInfoNotification.forEach( dataItem => {

                    console.log(dataItem.message + "IN THE Notifiactions");
                    document.getElementById("notificationContent").innerHTML += 'by '+dataItem.senderName+'<br>'+ dataItem.message +'<br> <br>';
                });

            } else {
                document.getElementById("notificationContent").innerHTML = "No notification <br> <br>"
            }


            if(data.employeeInfoSkills != null && data.employeeInfoSkills.length > 0){

                let element = document.getElementById("skillList");
                data.employeeInfoSkills.forEach( dataItem => {
                    document.getElementById("skillDropdown").innerHTML += "<option value="+dataItem+">"+ dataItem +"</option>";
                });
            }

        }else{
            document.cookie = "fail"
            window.location.href = "file:///C:/Users/mphut/Desktop/skillManagmentSystem/frontend/index.html";
        }

        console.log(data);
    });
}

async function checkSession(){

    console.log("check session")

    respose = await fetch('http://localhost:8080/Session/Check' , {
        method: 'POST',
        body: JSON.stringify(
            {
                "session" : document.cookie
            }),
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(res => res.json())
    .then(data => {


        console.log("===============================Print");
        console.log(data.sessionState);

        if(data.sessionState === "ok"){

            if(data.role === "employee"){
                // window.location.href = "file:///C:/Users/mphut/Desktop/skillManagmentSystem/frontend/Employee.html";
            }else if(data.role === "manager"){
                window.location.href = "file:///C:/Users/mphut/Desktop/skillManagmentSystem/frontend/Newtesting.html";
            }

        }else{
            document.cookie = "fail"
            window.location.href = "file:///C:/Users/mphut/Desktop/skillManagmentSystem/frontend/index.html";

        }
    });

}
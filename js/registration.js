$(document).ready(function() {

    // var registrationSuccess = <?php echo json_encode($registrationSuccess); ?>;
    // if (registrationSuccess) {
    //     Swal.fire({
    //         title: 'Successful',
    //         text: 'Welcome to SkillTracker',
    //         icon: 'success'
    //     }).then(function() {
    //         window.location.href = 'index.php';
    //     });
    // } else if (registrationSuccess === false && <?php echo count($errors); ?> > 0) {
    //     Swal.fire({
    //         title: 'Error',
    //         text: 'There was an issue with your registration. Please try again.',
    //         icon: 'error'
    //     });
    // }

    // danagerTitle.class='alert alert-danger



    // Password visibility toggle
    $('#togglePassword').click(function() {
        let passwordField = $('#password');
        let icon = $(this).find('img');
        if (passwordField.attr('type') === 'password') {
            passwordField.attr('type', 'text');
            icon.attr('src', 'https://img.icons8.com/material-outlined/24/000000/invisible.png');
        } else {
            passwordField.attr('type', 'password');
            icon.attr('src', 'https://img.icons8.com/material-outlined/24/000000/visible.png');
        }
    });

    $('#toggleRepeatPassword').click(function() {
        let passwordField = $('#repeat_password');
        let icon = $(this).find('img');
        if (passwordField.attr('type') === 'password') {
            passwordField.attr('type', 'text');
            icon.attr('src', 'https://img.icons8.com/material-outlined/24/000000/invisible.png');
        } else {
            passwordField.attr('type', 'password');
            icon.attr('src', 'https://img.icons8.com/material-outlined/24/000000/visible.png');
        }
    });

    getGroups();

});


async function getGroups(){

    console.log("Get groups")

    respose = await fetch('http://localhost:8080/getGroups')
    .then(res => res.json())
    .then(data => {

        console.log("Recevied groups===============================");
        console.log(data);

        if(data.groups != null && data.groups.length > 0){

            let element = document.getElementById("group");

            data.groups.forEach( dataItem => {
                const option = document.createElement('option');
                option.value = dataItem;
                option.textContent = dataItem;
                element.appendChild(option)
            });
        }
    });
}

document.getElementById('registrationForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    let danagerTitle = document.getElementById("dangerTitle");
    let file = document.getElementById('profile_picture').files[0];
    let fileExtention = file.name.split(".");
    let isSendData = true;

    console.log("File name: " + file.name)
    console.log("File Extention: " + fileExtention[1])
    

    if(document.getElementById('password').value != document.getElementById('repeat_password').value)
    {
        isSendData = false;

        Swal.fire({
            title: 'Error',
            text: 'There was an issue with your registration. Please try again.',
            type: 'error'
        });

        danagerTitle.innerHTML = "You did not repeat the correct password";
        danagerTitle.className = "alert alert-danger";
    }

    
    if(fileExtention[1] != null && (fileExtention[1] == "jpg" || fileExtention[1] == "png")){

        isSendData == true ? sendData() : null;

    } else {

        Swal.fire({
            title: 'Error',
            text: 'Please enter the correct image format',
            type: 'error'
        });

        danagerTitle.innerHTML = "Please input a image with the corret file format";
        danagerTitle.className = "alert alert-danger";
    }
});



async function sendData(){
    try {

        const formData = new FormData();
        formData.append('firstname', document.getElementById('firstname').value);
        formData.append('lastname', document.getElementById('lastname').value);
        formData.append('employeenumber', document.getElementById('employeenumber').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('password', document.getElementById('password').value);
        formData.append('group', document.getElementById('group').value);
        formData.append('profile_picture', document.getElementById('profile_picture').files[0]);

        const response = await fetch('http://localhost:8080/Registration/addEmployeeInfo', {
            method: 'POST',
            body: formData,
        })        
        .then(res => res.json())
        .then(data => {

            if(data.reDirectUrl){

            Swal.fire({
                title: 'Successful',
                text: 'Welcome to SkillTracker',
                type: 'success'
            }).then(function(){
                console.log(data.reDirectUrl);
                window.location.href = "file:///C:/Users/mphut/Desktop/skillManagmentSystem/frontend/"+data.reDirectUrl;
                });

            }else{
                Swal.fire({
                    title: 'Error',
                    text: 'There was an issue saving your data',
                    type: 'error'
                });
            }
        })
        
    } catch (error) {

        Swal.fire({
            title: 'Error',
            text: 'There is was an issue saving your data',
            type: 'error'
        });
    }
}
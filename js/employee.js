checkSession();

const skills = [];

document.getElementById('addSkill').addEventListener('click', function() {
    const skillInput = document.getElementById('skills');
    const skill = skillInput.value.trim();

    if (skill && !skills.includes(skill)) {
        skills.push(skill);
        updateSkillsList();
        skillInput.value = '';
        validateForm();
    }
});

function addSuggestedSkill(skill) {
    if (!skills.includes(skill)) {
        skills.push(skill);
        updateSkillsList();
        validateForm();
    }
}

function updateSkillsList() {
    const skillsList = document.getElementById('skillsList');
    skillsList.innerHTML = '';

    skills.forEach(skill => {
        const badge = document.createElement('span');
        badge.className = 'badge bg-primary skill-badge';
        badge.textContent = skill;

        const removeButton = document.createElement('button');
        removeButton.className = 'btn-close btn-close-white ms-2';
        removeButton.addEventListener('click', function() {
            const index = skills.indexOf(skill);
            if (index !== -1) {
                skills.splice(index, 1);
                updateSkillsList();
                validateForm();
            }
        });

        badge.appendChild(removeButton);
        skillsList.appendChild(badge);
    });

    document.getElementById('skillsData').value = skills.join(', ');
}

function validateForm() {
    const errorMessage = document.getElementById('errorMessage');
    const form = document.getElementById('employeeForm');

    // Validate that at least one skill is added or a file is uploaded
    if (skills.length === 0 && !document.getElementById('cv').files.length) {
        errorMessage.classList.remove('d-none');
        form.querySelector('button[type="submit"]').disabled = true;
    } else {
        errorMessage.classList.add('d-none');
        form.querySelector('button[type="submit"]').disabled = false;
    }
}

document.getElementById('atClient').addEventListener('change', function() {
    const companyField = document.getElementById('companyField');
    companyField.style.display = this.checked ? 'block' : 'none';
});



document.getElementById('employeeForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    document.getElementById('nonGeneralError').style.display = "none";
    document.getElementById('generalError').style.display = "none";
    
    const formData = new FormData();
    formData.append('skills', JSON.stringify(skills));
    formData.append('cv', document.getElementById('cv').files[0]);
    formData.append('companyName', document.getElementById('company').value);
    formData.append('deployed', document.getElementById('atClient').checked);
    formData.append('employeeId' , document.cookie)

   if( document.getElementById('cv').files[0] && skills.length > 0 ){

    
    try {
        const response = await fetch('http://localhost:8080/Employee/updateEmployeeInfo', {
            method: 'POST',
            body: formData,
        })    
        .then(res => res.json())
        .then(data => {

            if(data.reDirectUrl){
                console.log(data.reDirectUrl);
                window.location.href = "file:///C:/Users/mphut/Desktop/skillManagmentSystem/frontend/"+data.reDirectUrl;
            }

            if(data.error){
                console.log(data.error);
                
                document.getElementById('nonGeneralError').style.display = "block";
                document.getElementById('nonGeneralError').innerHTML = data.error; 

                Swal.fire({
                    title: 'Error',
                    text: 'There was an issue uploading your information.',
                    type: 'error'
                });
            }
        })
        
    } catch (error) {
        console.error('Error:', error);

        document.getElementById('nonGeneralError').style.display = "block";
        document.getElementById('nonGeneralError').innerHTML = "Something went wrong while sending your data";
    }

   } else{
    
        document.getElementById('generalError').style.display = "block";
        document.getElementById('generalError').innerHTML = "Please add CV and atleast 1 skill" 
   }


});

document.getElementById("deleteSession").addEventListener('click', async function(params) {

    console.log("Hell is coming");
    document.cookie = "fail";

    window.location.href = "file:///C:/Users/mphut/Desktop/skillManagmentSystem/frontend/index.html";
    
})




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
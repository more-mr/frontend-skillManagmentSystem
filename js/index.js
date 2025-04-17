checkSession();


document.getElementById("loginForm").addEventListener('submit', async function(event){
    event.preventDefault();

    let roleVal ="";
    let emailVal = document.getElementById("email").value;
    let passwordVal = document.getElementById("password").value;

    if(document.getElementById("roleManager").checked){
        roleVal = "manager";
    }else{ 
        roleVal = "employee";
    }

    const val = {
        role: roleVal,
        email: emailVal,
        password: passwordVal
    }

    try {
        fetch('http://localhost:8080/Login/loginOrchestration', {
            method: 'POST',
            body: JSON.stringify(val),
            headers: {
                "Content-Type": "application/json",
            },
        })    
        .then(res => res.json())
        .then(data => {

            if(data.error && data.reDirectUrl ){
                Swal.fire({
                    title: 'Error',
                    text: data.error,
                    type: 'error'
                })
                
            } else if(data.reDirectUrl){

                console.log(data.reDirectUrl);
                window.location.href = "file:///C:/Users/mphut/Desktop/skillManagmentSystem/frontend/"+data.reDirectUrl;
                document.cookie = data.session
            }
        })
    
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'There was an issue with login.',
            type: 'error'
        });
    }

});

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
                window.location.href = "file:///C:/Users/mphut/Desktop/skillManagmentSystem/frontend/Employee.html";
            }else if(data.role === "manager"){
                window.location.href = "file:///C:/Users/mphut/Desktop/skillManagmentSystem/frontend/Newtesting.html";
            }

        }else{
            document.cookie = "fail"
            // window.location.href = "file:///C:/Users/mphut/Desktop/skillManagmentSystem/frontend/index.html";

        }
    });

}
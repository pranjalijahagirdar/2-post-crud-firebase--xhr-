const cl=console.log;

const postForm = document.getElementById('postForm')
const titleControl = document.getElementById('titleControl')
const bodyControl = document.getElementById('bodyControl')
const userIdControl = document.getElementById('userIdControl')
const addpostBtn = document.getElementById('addpostBtn')
const updatepostBtn = document.getElementById('updatepostBtn')
const spinner = document.getElementById('spinner')


const BASE_URL = `https://crud-6b7ce-default-rtdb.firebaseio.com`
const BLOG_URL = `${BASE_URL}/blogs.json`


const state = {
    blogsArr : [],
    editId : null,
}

function showSpinner(){
    spinner.classList.remove('d-none')
}

function hideSpinner(){
    spinner.classList.add('d-none')
}

//read

function oncreateblogList(arr){
    let result = ``;
    arr.forEach((ele)=>{
        result +=
         `<div class="col-md-4 mb-4" id="${ele.id}">
            <div class="card h-100">
                <div class="card-header">
                    <h3>${ele.title}</h3>
                </div>
                <div class="card-body">
                    <p>${ele.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button onclick="editBlog(this)" class="btn btn-sm text-info" type="button">EDIT</button>
                    <button onclick="deleteBlog(this)" class="btn btn-sm text-primary" type="button">DELETE</button>
                </div>
            </div>
        </div>`

        const postList = document.getElementById('postList')
        postList.innerHTML = result;
    })

}

function fetchBlog(){
    showSpinner()
let xhr = new XMLHttpRequest()
    xhr.open("GET", BLOG_URL)
    xhr.send(null)
    xhr.onload = function(){
        if(xhr.status === 200){
            let res = JSON.parse(xhr.response)
            hideSpinner()
            for(const key in res){
                res[key].id = key
                state.blogsArr.push(res[key])
            }
            oncreateblogList(state.blogsArr)
        }
    }
}

fetchBlog()

//create

function onAddPost(eve){
    eve.preventDefault();
    showSpinner()
    let blogObj={
        userId:userIdControl.value,
        title:titleControl.value,
        body:bodyControl.value,
    }
    let xhr = new XMLHttpRequest()

    xhr.open("POST", BLOG_URL)
    xhr.send(JSON.stringify(blogObj));
    xhr.onload = function(){
        if(xhr.status >=200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response)
            blogObj.id = res.name;
            let col = document.createElement('div')
            col.className = 'col-md-4 mb-4'
            state.blogsArr.push(blogObj)
            col.id = blogObj.id;
            col.innerHTML = `<div class="card h-100">
                    <div class="card-header">
                        <h3>${blogObj.title}</h3>
                    </div>
                    <div class="card-body">
                        <p>${blogObj.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="editBlog(this)" class="btn btn-sm text-info" role="button">EDIT</button>
                        <button onclick="deleteBlog(this)" class="btn btn-sm text-primary" role="button">DELETE</button>
                    </div>
                </div>`
            postForm.reset()
            const postList = document.getElementById('postList')
            postList.prepend(col)

        }else{
            cl(`something went wrong !!!`)
        }
        hideSpinner()
    }
    xhr.onerror = function(){
        hideSpinner()
    }
}


//edit

function editBlog(ele){
    let editId = ele.closest('.col-md-4').id;
    state.editId = editId;
    let EDIT_URL = `${BASE_URL}/blogs/${editId}.json`
    showSpinner()
    let xhr = new XMLHttpRequest()
    xhr.open("GET", EDIT_URL)
    xhr.send(null)
    xhr.onload = function(){
        hideSpinner()
        if(xhr.status >= 200 &&  xhr.status <=299){
            let res = JSON.parse(xhr.response)
            userIdControl.value = res.userId;
            titleControl.value = res.title;
            bodyControl.value = res.body;
            addpostBtn.classList.add('d-none')
            updatepostBtn.classList.remove('d-none')
        }
    }
    xhr.onerror = function(){
        hideSpinner()
    }
}

//update 

function onUpdateBlog(){
    let update_Id = state.editId;
    let UPDATE_URL = `${BASE_URL}/blogs/${update_Id}.json`
    let updateObj={
            userId : userIdControl.value,
            title : titleControl.value,
            body : bodyControl.value,
    }
    showSpinner()
    let xhr = new XMLHttpRequest()
    xhr.open("PATCH", UPDATE_URL)
    xhr.send(JSON.stringify(updateObj))
    xhr.onload = function(){
        hideSpinner()
        if(xhr.status >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response);
            cl(res)
            let tds = document.getElementById(update_Id)
            tds.querySelector('h3').innerHTML = updateObj.title;
            tds.querySelector('p').innerHTML = updateObj.body;
            postForm.reset()
           addpostBtn.classList.remove('d-none')
            updatepostBtn.classList.add('d-none')
        }
    }
    xhr.onerror = function(){
        hideSpinner()
    }
}

//delete

function deleteBlog(ele){
    let delete_Id = ele.closest('.col-md-4').id;
    Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed){
    showSpinner()
    let REMOVE_URL = `${BASE_URL}/blogs/${delete_Id}.json`
    let xhr = new XMLHttpRequest()
    xhr.open("DELETE", REMOVE_URL)
    xhr.send(null)
    xhr.onload = function(){
        if(xhr.status  >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response)
            ele.closest('.col-md-4').remove()
        }
        hideSpinner()
    }
}
});
xhr.onerror = function(){
    hideSpinner()
}
}

postForm.addEventListener('submit', onAddPost)
updatepostBtn.addEventListener('click', onUpdateBlog)
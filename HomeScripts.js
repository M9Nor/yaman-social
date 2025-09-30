// هي للدوال الخاصة بصفحة HOME

signInUser()


lastPage = 1
currentpage = 1
let loading = false

//============ infinite scroll ==============

window.addEventListener("scroll", () =>{
  const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
    
  if (endOfPage && currentpage < lastPage && !loading) {
    
    currentpage ++
   postrequest( false , currentpage) 

  }

});
//============ //// infinite scroll ///// ==============



function postrequest(reload = true ,page = 1 ) {
    toggleloader(true)
    loading = true
    axios.get(`${urlTrmeez}/posts?limit=4&page=${page}`)
      
    .then(function (response) {
     toggleloader(false)
     loading = false
     lastPage = response.data.meta.last_page
     let posts = response.data.data;
      if(reload){
      document.getElementById("posts").innerHTML = "";
      }
      for (let post of posts) {
        let user = CurrentUser()
        let myPost = user != null && post.author.id == user.id
        let EditBtnContent =`` 

      if(myPost){
          EditBtnContent = `
              <button type="button" class="btn btn-danger"   onclick="DeleteBtnPost('${encodeURIComponent(JSON.stringify(post))}')"  style="float:right; margin-left: 8px;" >Delete</button>
              <button type="button" class="btn btn-dark"  onclick="EditBtnClicked('${encodeURIComponent(JSON.stringify(post))}')" style="float:right;" >Edit</button>`
          }


        let content = `
                    <div class="card shadow my-5" >
                          <div  > 
                                <div class="card-header"  style="cursor: pointer;" >

                                    <span onclick="userClicked(${post.author.id})">
                                        <img class="border rounded-circle border-2" src="${post.author.profile_image}"  alt="" style="width: 40px; height: 40px;">
                                        <b class="fs-6 " >${post.author.username}</b>
                                    </span>
                                    ${EditBtnContent}
                                </div>
                            <div onclick="postclicked(${post.id})" class="card-body"  style="cursor: pointer;">
                                    <img src="${post.image ?? ""}" class="  w-100 img-fluid">
                                    <h6 class="mt-1" style="color: rgb(193, 193, 193);">${post.created_at ?? ""}</h6>
                                    <h5 class="card-title fs-5">${post.title ?? ""}</h5>
                                    <p class="card-text fs-6">${post.body ?? ""}</p>
                                        <hr>
                                   <div class="d-flex justify-content-start ">
                         <div class="d-flex align-items-center mx-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 1 .642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                            </svg>
                            <span >
                              (${post.comments_count}) comments
                            </span>
                              <span id="tags">
                              </span>
                            </div>
                        </div> 
                     </div>
                `;
        document.getElementById("posts").innerHTML += content;
    //  todo:لسا بدها شغل للتاغات
        // const currenttagsID = `tags-${post.id}`
        // for(let tag of post.tags){
        //   console.log(tag.name)
        //       let tagscontent = `
              
        //          <button class="btn btn-sm rounded-5  " style="background-color: gray; color: #f9f3fe;" >${tag.name}</button>
               
        //           `
        // document.getElementById(currenttagsID).innerHTML += tagscontent;
        // }
        
     }
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(() => {
      loading = false
      toggleloader(false)
    });
}
postrequest();


function userClicked(userId){
    window.location = `profile.html?userId=${userId}`
} 

function postclicked(postId){
   window.location = `mainLogic.html?postId=${postId}`
}


function CreatePostBtn(){
        const Title = document.getElementById("title-input").value
        const body = document.getElementById("message-text").value
        const img = document.getElementById("input-file").files[0]
        const postId = document.getElementById("post_id_input").value 
        const token =localStorage.getItem("token")


        let isCreat = postId == null || postId == ""
        let url =``

        let formData = new FormData()
          formData.append("title" , Title)           
          formData.append("body" , body)          
          formData.append("image" , img)          

        let headers ={
          "Content-Type":  "multipart/form-data" ,
          "Authorization" : `Bearer ${token}`
        }

        if (isCreat){
            url=  `${urlTrmeez}/posts`
        }else{
            formData.append("_method" , "Put") 
            url =`${urlTrmeez}/posts/${postId}`

        }
        axios.post(url, formData ,{
          headers : headers
        }

        )
          .then(function (response) {
          
            
              const Modal= document.getElementById("NewPostModal")
              const ModalInstance = bootstrap.Modal.getOrCreateInstance(Modal)
              ModalInstance.hide()

              signInUser()
              appendAlert('!تم بنجاح', 'success')
              postrequest()

          })
          .catch(function (error) {
            console.log(error)
              const Modal= document.getElementById("NewPostModal")
              const ModalInstance = bootstrap.Modal.getOrCreateInstance(Modal)
              ModalInstance.hide()


              let Error = error.response.data.message;
              appendAlert(Error, 'danger')
              

          });

}

function addPostBtn(){
document.getElementById("post_title_input").innerHTML = "Create Post"
document.getElementById("title-input").value = ""
document.getElementById("message-text").value = ""
document.getElementById("post_id_input").value = ""
document.getElementById("post_edit_input").innerHTML = "Create"
let postModal = new bootstrap.Modal(document.getElementById("NewPostModal"), {})
postModal.toggle()


}

function toggleloader(show = true){

  if(show){
    document.getElementById("loder").style.visibility = 'visible'
  }else{
    document.getElementById("loder").style.visibility = 'hidden'
  }
}


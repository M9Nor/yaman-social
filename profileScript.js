// هي للدوال الخاصة بصفحة PROFILE

signInUser()
postrequest();
function getCurrentUserId(){
 const urlParams = new URLSearchParams(window.location.search)
  const id= urlParams.get("userId")
return id
}
 

  function UserShowPost(){
    const id = getCurrentUserId()
    toggleloader(true)
    axios.get(`${urlTrmeez}/users/${id}`)
    .then(function (response) {
    toggleloader(false)
    let user = response.data.data;
    document.getElementById("usernameinfo").innerHTML = user.username;
    let usercontent =``
    usercontent +=` 

               <div   class="card shadow p-5" >
                 <div class="row">
                <!-- PROFILE IMAGE -->
                    <div class="col-3 ">
                          <img class="border rounded-circle border-2" src="${user.profile_image}" alt=""
                                        style="width: 100px; height: 100px;">
                    </div>
                     <!-- // PROFILE IMAGE // -->
                      <!-- PROFILE -NAME-USERNAME-EMAIL  -->
                       <div class="col-5" style="display: flex;justify-content: space-around;flex-direction: column;">
                          <div class="profile_info" >
                            ${user.name}
                          </div>
                          <div class="profile_info">
                             ${user.email}
                          </div>
                          <div class="profile_info">
                            ${user.username}
                          </div>

                       </div>
                      <!-- // PROFILE -NAME-USERNAME-EMAIL // -->
                       <!-- PROFILE POST-COMMENTS --COUNT -->
                        <div class="col-4 " style="display: flex;justify-content: space-around;flex-direction: column;align-items: self-start">
                           <div class="number_info">
                             <span>${user.posts_count}</span>Posts
                           </div>
                           <div class="number_info">
                             <span>${user.comments_count}</span>Comments
                           </div>
                        </div>
                       <!-- // PROFILE POST-COMMENTS --COUNT // -->
                       </div>
               </div>
   
        <!-- // PROFILE CARD // -->





`
  document.getElementById("profileCard").innerHTML = usercontent;
  
    })
}

UserShowPost()

function postrequest() {
   const id = getCurrentUserId()
   toggleloader(true)
   axios.get(`${urlTrmeez}/users/${id}/posts`)
    .then(function (response) {
      toggleloader(false)
     let posts = response.data.data;
     document.getElementById("user_posts").innerHTML = "";
    for (let post of posts) {
        let user = CurrentUser()
        let myPost = user != null && post.author.id == user.id
        let EditBtnContent =`` 

        if(myPost){
          EditBtnContent =`
              <button type="button" class="btn btn-danger"   onclick="DeleteBtnPost('${encodeURIComponent(JSON.stringify(post))}')"  style="float:right; margin-left: 8px;" >Delete</button>
              <button type="button" class="btn btn-dark"  onclick="EditBtnClicked('${encodeURIComponent(JSON.stringify(post))}')" style="float:right;" >Edit</button>`
          }


        let content = `
                    <div class="card shadow my-5" >
                          <div  > 
                                <div class="card-header">
                                    <img class="border rounded-circle border-2" src="${post.author.profile_image}"  alt="" style="width: 40px; height: 40px;">
                                    <b class="fs-6 "  >${post.author.username}</b>

                                  ${EditBtnContent}
                                </div>
                            <div  class="card-body" >
                                    <img src="${post.image ?? ""}" class="  w-100 img-fluid">
                                    <h6 class="mt-1" style="color: rgb(193, 193, 193);">${post.created_at ?? ""}</h6>
                                    <h5 class="card-title fs-5">${post.title ?? ""}</h5>
                                    <p class="card-text fs-6">${post.body ?? ""}</p>
                                        <hr>
                                   <div class="d-flex justify-content-start ">
                         <div class="d-flex align-items-center mx-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
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
        document.getElementById("user_posts").innerHTML += content;
     }
    })
    .catch(function (error) {
      console.log(error);
    });
}



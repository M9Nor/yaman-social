// ======================================================
// ملف: mainLogic.js
// الغرض العام:
// - يضم الدوال المشتركة بين الصفحات (Home, Profile, Post Details).
// - يتكفّل بعمليات المصادقة (تسجيل الدخول/التسجيل/الخروج).
// - يضبط عناصر الواجهة بحسب حالة المستخدم (ضيف/مسجل دخول).
// - يوفّر دوال التعامل مع البوستات (إنشاء/تعديل/حذف) بشكل مشترك.
// ملاحظات مهمة:
// - عنوان الـ API محدد في المتغيّر `urlTrmeez`.
// - استخدمنا تعليقات مُجزّأة لشرح كل قسم بشكل فقرة واضحة.
// ======================================================

// هي الصفحة مشتركة بين كل الصفحات في الدوال
let urlTrmeez = "https://tarmeezacademy.com/api/v1"
signInUser()

// ------------------------------------------------------
// قسم: إنشاء/تعديل البوست (CreatePostBtn)
// الهدف:
// - يقرأ مدخلات المودال ويقرر إن كان الطلب إنشاء جديد أم تحديث.
// - يرسل الطلب عبر FormData مع دعم الصورة إن وُجدت.
// - يعالج الواجهة: إظهار/إخفاء اللودر، إغلاق المودال، تنبيهات النجاح/الفشل، ثم إعادة تحميل البيانات.
// ------------------------------------------------------
function CreatePostBtn(){
        console.log('[CreatePostBtn] clicked')
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
          if (img) { formData.append("image" , img) }

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
        toggleloader(true)
        axios.post(url, formData ,{
          headers : headers
        }

        )
          .then(function (response) {
              toggleloader(false)
              const Modal= document.getElementById("NewPostModal")
              if(Modal && window.bootstrap && bootstrap.Modal){
                const ModalInstance = bootstrap.Modal.getOrCreateInstance(Modal)
                ModalInstance.hide()
              }

              signInUser()
              appendAlert('!تم بنجاح', 'success')
              postrequest()

          })
          .catch(function (error) {
            console.log(error)
              const Modal= document.getElementById("NewPostModal")
              if(Modal && window.bootstrap && bootstrap.Modal){
                const ModalInstance = bootstrap.Modal.getOrCreateInstance(Modal)
                ModalInstance.hide()
              }


              let Error = (error && error.response && error.response.data && error.response.data.message) ? error.response.data.message : 'Action failed';
              appendAlert(Error, 'danger')
              

          });

}

// ------------------------------------------------------
// قسم: فتح مودال إضافة بوست جديد (مشترك Home & Profile)
// فكرة الدالة:
// - تصفير الحقول، تعيين النصوص الافتراضية، ثم إظهار المودال بأمان إذا كان Bootstrap متاحاً.
// ------------------------------------------------------
function addPostBtn(){
  console.log('[addPostBtn] open modal')
  const titleEl = document.getElementById("title-input")
  const bodyEl = document.getElementById("message-text")
  const postIdEl = document.getElementById("post_id_input")
  const postTitleLabel = document.getElementById("post_title_input")
  const actionBtn = document.getElementById("post_edit_input")
  if(postTitleLabel){ postTitleLabel.innerHTML = "Create Post" }
  if(titleEl){ titleEl.value = "" }
  if(bodyEl){ bodyEl.value = "" }
  if(postIdEl){ postIdEl.value = "" }
  if(actionBtn){ actionBtn.innerHTML = "Create" }
  const modalEl = document.getElementById("NewPostModal")
  if(modalEl && window.bootstrap && bootstrap.Modal){
    const postModal = new bootstrap.Modal(modalEl, {})
    postModal.show()
  }
}

// ------------------------------------------------------
// قسم: تعديل وحذف البوست
// - EditBtnClicked: يملأ المودال ببيانات البوست ويعرضه بوضعية التعديل.
// - DeleteBtnPost: يفتح مودال الحذف ويخزن المعرّف داخله بمدخل مخفي.
// - confirmPostDelete: يرسل طلب الحذف ويحدّث الواجهة بحسب النتيجة.
// ------------------------------------------------------
function EditBtnClicked(postobject){
      let post = JSON.parse(decodeURIComponent(postobject))


      document.getElementById("post_title_input").innerHTML = "Edit Post"
      document.getElementById("title-input").value = post.title
      document.getElementById("message-text").value = post.body
      document.getElementById("post_id_input").value = post.id
      document.getElementById("post_edit_input").innerHTML = "Update"


      const modalEl = document.getElementById("NewPostModal")
      if(modalEl && window.bootstrap && bootstrap.Modal){
        const postModal = new bootstrap.Modal(modalEl, {})
        postModal.show()
      } else {
        appendAlert('Modal not available on this page', 'danger')
      }

      }

function DeleteBtnPost(postobject){
          let post = JSON.parse(decodeURIComponent(postobject))
          document.getElementById("post_Delete_input").value =post.id
          const modalEl = document.getElementById("DeletePostModal")
          if(modalEl && window.bootstrap && bootstrap.Modal){
            const postModal = new bootstrap.Modal(modalEl, {})
            postModal.show()
          } else {
            appendAlert('Delete modal not available on this page', 'danger')
          }

      }
      
function confirmPostDelete(){
          const postId = document.getElementById("post_Delete_input").value
          const token =localStorage.getItem("token")
          let headers ={
            "Authorization" : `Bearer ${token}`
          }
          toggleloader(true)
          let url =`${urlTrmeez}/posts/${postId}`
          axios.delete(url,{
            headers : headers
          }

          )
            .then(function (response) {
              toggleloader(false)
                const Modal= document.getElementById("DeletePostModal")
                if(Modal && window.bootstrap && bootstrap.Modal){
                  const ModalInstance = bootstrap.Modal.getOrCreateInstance(Modal)
                  ModalInstance.hide()
                }
                signInUser()
                appendAlert('!تم حذف البوست بنجاح', 'success')
                postrequest()

            })
            //this is for error handling
            .catch(function (error) {
                const Modal= document.getElementById("DeletePostModal")
                if(Modal && window.bootstrap && bootstrap.Modal){
                  const ModalInstance = bootstrap.Modal.getOrCreateInstance(Modal)
                  ModalInstance.hide()
                }
                console.log(error)
                let Error = (error && error.response && error.response.data && error.response.data.message) ? error.response.data.message : 'Delete failed';
                appendAlert(Error, 'danger')
                

            });


}

// ------------------------------------------------------
// قسم: الانتقال إلى صفحة البروفايل الخاص بالمستخدم الحالي
// - إن لم يكن مسجلاً: نظهر تنبيه ونفتح مودال تسجيل الدخول.
// - إن كان مسجلاً: نعيد توجيهه إلى `profile.html?userId=...`.
// ------------------------------------------------------
function profilePageClicked(){
    const user = CurrentUser()
    if(!user){
      appendAlert('Please login to open your profile', 'danger')
      const loginModalEl = document.getElementById('LoginModal')
      if(loginModalEl && window.bootstrap && bootstrap.Modal){
        const loginModal = new bootstrap.Modal(loginModalEl, {})
        loginModal.show()
      }
      return
    }
    const userId = user.id
    window.location = `profile.html?userId=${userId}`
    
}


// ------------------------------------------------------
// قسم: signInUser
// الهدف:
// - يعكس حالة المصادقة على عناصر الواجهة: إظهار أزرار الدخول/الخروج والصورة واسم المستخدم.
// - يُظهر زر الإضافة فقط للمستخدمين المسجّلين.
// ------------------------------------------------------
  function signInUser(){
            const LoginDiv = document.getElementById("Logged_in_successfully")
            const LogOutDiv = document.getElementById("Login_Unsuccessful")
            const Img_Name_Profile = document.getElementById("Img_Name_Profile")
            const img_profile =document.getElementById("img_profile")
            const Username_profile =document.getElementById("Username_profile")
            const addBtn = document.getElementById("addbtn")

            let token = localStorage.getItem("token")

            let IsGuest = (token == null )

            LoginDiv.style.setProperty("display" , IsGuest ? "none" : "flex" ,"important")
            LogOutDiv.style.setProperty("display" , IsGuest ? "flex" : "none" ,"important")
            Img_Name_Profile.style.setProperty("display" , IsGuest ? "none" : "flex" ,"important")
            if (addBtn){
              addBtn.style.setProperty("display" , IsGuest ? "none" : "inline-flex" ,"important")
            }

            let user = CurrentUser()
            if(!IsGuest && user){
            img_profile.src = user.profile_image
            Username_profile.innerHTML = user.username
            }
            }



// ================= AUTH FUNCTIONS =====================
// قسم: المصادقة (تسجيل الدخول/التسجيل/الخروج)
// - loginbtn: إرسال بيانات الدخول وتخزين التوكين والمستخدم ثم تحديث الواجهة.
// - Registerloginbtn: إرسال بيانات التسجيل مع الصورة، وتوليد اسم مستخدم فريد.
// - logOut: مسح بيانات المستخدم من التخزين المحلي وتحديث الواجهة.
// ======================================================

function  loginbtn(){
    let username_input = document.getElementById("username-input").value
    let password_input = document.getElementById("password-input").value
    toggleloader(true)
  axios.post(`${urlTrmeez}/login`, {
      "username" : username_input,
      "password" : password_input
  })
    .then(function (response) {
      toggleloader(false)
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))

      const Modal= document.getElementById("LoginModal")
      const ModalInstance = bootstrap.Modal.getOrCreateInstance(Modal)
      ModalInstance.hide()

            
                
      signInUser()
      appendAlert('!تم تسجيل الدخول بنجاح', 'success')
      postrequest()

    })
    .catch(function (error) {
      console.log(error)
        const Modal= document.getElementById("LoginModal")
        const ModalInstance = bootstrap.Modal.getOrCreateInstance(Modal)
        ModalInstance.hide()


        let Error = error.response.data.message;
        appendAlert(Error, 'danger')
        
    
    });

}


function Registerloginbtn(){
  let Register_username = document.getElementById("Register-username-input").value
  let Register_Name = document.getElementById("Register-Name-input").value
  let Register_password = document.getElementById("Register-password-input").value
  let Register_input_File = document.getElementById("input-file-Register").files[0]
  let uniqueUsername = Register_username + "_" + Date.now();   //منشان يجيب اسم كل مرة متغير ما يكون موجود


  let formData = new FormData()
  formData.append("username", uniqueUsername)  
  formData.append("name", Register_Name)  
  formData.append("password", Register_password)  
  formData.append("image", Register_input_File)  

  toggleloader(true)
  axios.post(`${urlTrmeez}/register`,formData )
    .then(function (response) {
       toggleloader(false)
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))

        const Modal= document.getElementById("RegisterModal")
        const ModalInstance = bootstrap.Modal.getOrCreateInstance(Modal)
        ModalInstance.hide()
      
        document.getElementById("Register-username-input").value = ""
        document.getElementById("input-file-Register").files[0] = ""

     signInUser()
        appendAlert('!تم تسجيل المستخدم بنجاح', 'success')
        postrequest()



    })
    .catch(function (error) {
      console.log(error)
        const Modal= document.getElementById("RegisterModal")
        const ModalInstance = bootstrap.Modal.getOrCreateInstance(Modal)
        ModalInstance.hide()


        let Error = error.response.data.message;
        appendAlert(Error, 'danger')
        

    });

}

function logOut(){
 localStorage.removeItem("token")
 localStorage.removeItem("user")
 
 signInUser()
 appendAlert('!تم الخروج بنجاح', 'success')
 postrequest()
}


// ------------------------------------------------------
// قسم: أدوات مساعدة للواجهة
// - appendAlert(message, type): عرض تنبيه مؤقت أسفل يمين الشاشة.
// - CurrentUser(): قراءة المستخدم المخزّن في LocalStorage وإرجاعه ككائن.
// - toggleloader(show): إظهار/إخفاء اللودر إذا كان موجوداً في الصفحة.
// ------------------------------------------------------
function appendAlert(message, type) {
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show " role="alert">
            <div>${message}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    let alertElement = wrapper.firstElementChild
  alertPlaceholder.append(alertElement );

    setTimeout(() => {
        alertElement.classList.remove("show"); 
        alertElement.classList.add("fade"); 
     
    }, 2000)
}

function CurrentUser(){

let user = null 
const userStorage = localStorage.getItem("user")

if (userStorage !== null){

  user = JSON.parse(userStorage)

}
  return user
}



// ملاحظة: إظهار/إخفاء اللودر بشكل آمن (لا يفعل شيئاً إن لم يوجد العنصر)
function toggleloader(show = true){
  const el = document.getElementById("loder")
  if(!el){
    return
  }
  if(show){
    el.style.visibility = 'visible'
  }else{
    el.style.visibility = 'hidden'
  }
}

// عند جاهزية الـ DOM: نحاول تحديث الواجهة لتعكس حالة المصادقة (مثلاً وجود زر الإضافة)
document.addEventListener('DOMContentLoaded', () => {
  try { signInUser() } catch (e) { /* no-op */ }
})


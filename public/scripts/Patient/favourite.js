const userID = document.getElementById('userID');

window.onload = function() {
    fetchAllFavouritList()
};

async function fetchAllFavouritList(){
    try {
        const response = await fetch(`/patient/favourite/${userID.textContent}`, { method: 'POST' });
        const savedList = await response.json();

        if(savedList.status){
            createSavedDocList(savedList.savedDoctorsRecords)
        } 
        
        } catch (err) {
            console.error('Error Get Saved Doctors:', err);
            alert('Error Get Saved Doctors');
        }
}


function createSavedDocList(approveList){
    
    const approveListDiv  = document.getElementById('approveListDiv');
    approveListDiv.innerHTML = ''

    approveList.forEach(oneList => {

        const div = document.createElement('div');
        div.className = ''; 
        div.classList.add('col-md-6', 'col-lg-4', 'col-xl-3');

        div.innerHTML = `
        
        <div class="profile-widget">
                      <div class="doc-img">
                        <a href="/doctor-profile.html">
                          <img
                            class="img-fluid"
                            alt="User Image"
                            src="${oneList.profilePicture}"
                          />
                        </a>
                        <a class="fav-btn savedBtn" data-saveid="${oneList.userID}">
                          <i class="far fa-bookmark"></i>
                        </a>
                      </div>
                      <div class="pro-content">
                        <h3 class="title">
                          <a href="doctor-profile.html">Dr.${oneList.name}</a>
                          <i class="fas fa-check-circle verified"></i>
                        </h3>
                        <p class="speciality">
                        ${oneList.specialization.specialist}
                        </p>
    
                        <ul class="available-info">
                          <li>
                            <i class="fas fa-map-marker-alt"></i> ${oneList.address.city}, ${oneList.address.country}
                          </li>
                      
                        </ul>
                        <div class="row row-sm">
                          <div class="col-6">
                            <a href="doctor-profile.html" class="btn view-btn"
                              >View Profile</a
                            >
                          </div>
                          <div class="col-6">
                            <a href="booking.html" class="btn book-btn"
                              >Book Now</a
                            >
                          </div>
                        </div>
                      </div>
                    </div>
        `
        approveListDiv.append(div)
    })

    if(approveList.length === 0) {
      Swal.fire({
          title: 'No Doctors Found!',
          text: 'Please check your saved list and try again.',
          icon: 'info',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
      });
      return;
  }

    const allSavedBtn = document.querySelectorAll('.savedBtn')
    allSavedBtn.forEach(oneSaveBtn => {
      oneSaveBtn.addEventListener('click', saveFunction);
    })
}



async function saveFunction(e){
    const button = e.target.closest('.savedBtn');
   
    try {
      const response = await fetch(`/patient/favourite/remove/${button.dataset.saveid}/${userID.textContent}`, { method: 'POST' });
      const statusMessage = await response.json();
  
      if(statusMessage.status){
        await Swal.fire({
          title: 'Doctor Removed',
          text: 'The doctor has been successfully removed from your favorites.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
      });
      fetchAllFavouritList();
      }
  
    }catch(e){
      console.error('Error Update Status:', e);
      await Swal.fire({
        title: 'Error',
        text: 'Unable to update the status. Please try again later.',
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
    });
    }
  }
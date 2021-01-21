import Swal from 'sweetalert2/dist/sweetalert2.js'

export class alertService {
    tinyAlert(){
        Swal.fire('Hey there!');
      }
      
      successNotification(){
        Swal.fire('Hi', 'We have been informed!', 'success')
      }
      
      alertConfirmation(){
        Swal.fire({
          title: 'Are you sure?',
          text: 'This process is irreversible.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, go ahead.',
          cancelButtonText: 'No, let me think'
        }).then((result) => {
          if (result.value) {
            Swal.fire(
              'Removed!',
              'Product removed successfully.',
              'success'
            )
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
              'Cancelled',
              'Product still in our database.)',
              'error'
            )
          }
        })
      }  
}
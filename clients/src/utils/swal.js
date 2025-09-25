import Swal from 'sweetalert2';

/**
 * Show a SweetAlert2 modal with custom options.
 * @param {Object} options - SweetAlert2 options (title, text, icon, etc.)
 * @returns {Promise<SweetAlertResult>} - The SweetAlert2 promise.
 */
export function showAlert(options) {
    return Swal.fire(options);
}

/**
 * Show a success alert with a message.
 * @param {string} message
 */
export function showSuccess(message) {
    return Swal.fire({
        icon: 'success',
        title: 'Success',
        text: message,
        timer: 1800,
        showConfirmButton: false,
    });
}

/**
 * Show an error alert with a message.
 * @param {string} message
 */
export function showError(message) {
    return Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        timer: 2200,
        showConfirmButton: false,
    });
}

/**
 * Show a confirmation dialog.
 * @param {string} message
 * @returns {Promise<SweetAlertResult>}
 */
export function showConfirm(message) {
    return Swal.fire({
        title: 'Are you sure?',
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
    });
}

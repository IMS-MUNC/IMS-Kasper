import Swal from "sweetalert2";

const DeleteAlert = async ({
  title = "Are you sure?",
  text = "You won't be able to revert this!",
  confirmButtonText = "Yes, delete it!",
  confirmButtonColor = "#3085d6",
  cancelButtonColor = "#d33",
  icon = "warning",
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor,
    cancelButtonColor,
    confirmButtonText,
  });

  return result.isConfirmed;
};

export default DeleteAlert;




<script>
  import toastr from "toastr";
  const onInvite = () => {
    var dummy = document.createElement("input");

    document.body.appendChild(dummy);
    dummy.value = window.location.href;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);

    toastr.success("Invite url copyed to clipboard", {
      positionClass: "toast-top-center"
    });
  };
</script>

<style>
  button {
    margin-left: 0;
  }
</style>

<button on:click={onInvite}>Invite</button>

function initEntry(uid, uname)
{
    console.log(uid);
    console.log(uname);

    let state = {
        uid: uid,
        uname: uname
    };

    $('#user-id').html(state.uid);
    $('#user-name').html(state.uname);
    $("#uname").val(state.uname);
    // console.log($(".user-id").html());
    // let test = $('#test');
    // test.html("It works");
    // console.log("We should have tested");
    // $("#test").html("It works!");

}
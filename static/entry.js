function initEntry(uid, uname)
{
    var state = {
        uid: uid,
        uname: uname
    };
    $("#user-id").val(state.uid);
    $("#user-name").val(state.uname);
}
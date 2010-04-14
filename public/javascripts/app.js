$(document).ready(function () {
  // FB Connect action
  $('#fb-connect').bind('click', function () {
    $.fbConnect({'include': ['first_name', 'last_name', 'name', 'pic']}, function (fbSession) {
      $('.not_authenticated').hide();
      $('.authenticated').show();
      $('#fb-name').html(fbSession.name);
      $('#fb-pic > a > img').attr('src', fbSession.pic);
      $('#fb-pic > a > img').attr('alt',fbSession.name);
    });
    return false;
  });

  // FB Logout action
  $('#fb-logout').bind('click', function () {
    $.fbLogout(function () {
      $('.authenticated').hide();
      $('.not_authenticated').show();
    });
    return false;
  });

  // Check whether we're logged in and arrange page accordingly
  $.fbIsAuthenticated(function (fbSession) {
    // Authenticated!
    $('.authenticated').show();
    $('#fb-name').html(fbSession.name);
  }, function () {
    // Not authenticated
    $('.not_authenticated').show();
  });

  $('#messages').fadeOut(5000, function() {
     $('#message');
  });
});

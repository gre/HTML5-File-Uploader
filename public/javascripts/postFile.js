(function(){
  
  var PostFile = function() {
    
    return {
      
      init: function() {
        $('.postFile form input').val('').change(function(){
          var postFileNode = $(this).parents('.postFile');
          $('form', postFileNode).ajaxSubmit({
            beforeSubmit: function() {
              $('.message', postFileNode).empty();
              $('img.postFileLoad', postFileNode).show();
            },
            success: function(responseText, statusText, xhr) {
              $('input', xhr).val('');
              $('img.postFileLoad', postFileNode).hide();
              $('.message', postFileNode).append(responseText);
            }
          });
        });
        
      }
      
    }
  }();
  $(document).ready(PostFile.init);
  
}());

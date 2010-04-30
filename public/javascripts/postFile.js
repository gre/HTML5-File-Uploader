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
        
        $('.postFile form .dropzone').each(function(){
            $(this).droppable($(this).attr('accept'),
                // Drag enter
                function(e) {
                    $(this).addClass('filehover');
                },
                // Drag leave
                function() {
                    $(this).removeClass('filehover');
                },
                // Drop!
                function(e) {
                  debugger
                    //$('ul', this).append('<li>' + e.dataTransfer.files[0].fileName + '</li>')
                });
          });
                
      }
      
    }
  }();
  $(document).ready(PostFile.init);
  
}());

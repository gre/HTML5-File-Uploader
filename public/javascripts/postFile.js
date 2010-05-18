(function(){
  
  var DEBUG = true;
  
  
  var log = (!DEBUG||typeof(console)=="undefined"||typeof(console['log'])=="undefined") 
            ? function(){}
            : console.log;
  
  
  var PostFile = function() {
    
    var isSupported_FormData = typeof(FormData)!="undefined";
    //var isSupported_DataTransfert = typeof(DataTransfert)!="undefined";
    var isSupported_DragAndDrop = ('draggable' in document.createElement('span'));
    
    /**
     * file can be :
     *  - an input[type=file]
     *  - a DataTransfert
     */
    var upload = function(file, form) {
      if(file instanceof jQuery)
        file = file[0];
      
      var name = $('input',form).attr('name') ||  $('.dropzone',form).attr('name') || 'file';
      var method = form.attr('method') || 'POST';
      var action = form.attr('action') || window.location.pathname;
      
      if(isSupported_FormData) {
        log("uploading with FormData");
        // FormData supported
        var formdata = new FormData();
        formdata.append(name, file);
        var xhr = new XMLHttpRequest();
        xhr.open(method, action);  
        xhr.send(formdata);
      }
      else {
        log("uploading with ajaxSubmit");
        $(form).ajaxSubmit({
          beforeSubmit: function() {
            $('.message', form).empty();
            $('img.postFileLoad', form).show();
          },
          success: function(responseText, statusText, xhr) {
            $('input', xhr).val('');
            $('img.postFileLoad', form).hide();
            $('.message', form).append(responseText);
          }
        });
      }
      
    };
    
    
    return {
      
      init: function() {
        
        $('.postFile form').each(function(){
          var form = $(this);
          
          $('.removeIfAsynchronous').remove();
          
          $('input', form).val('').change(function(){
            upload(this.files ? this.files[0] : null, form);
          });
          
          if(isSupported_DragAndDrop) {
            $('.hideIfDropSupported', form).hide();
            $('.dropzone', form).each(function(){
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
                      upload(e.dataTransfer.files[0], form);
                    });
            });
          }
          else {
            $('.hideIfDropNotSupported', form).hide();
          }
        });
                
      }
      
    }
  }();
  $(document).ready(PostFile.init);
  
}());

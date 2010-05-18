/*
 * Copyright - 2010 - Gaetan Renaudeau <gre@zenexity.fr> - Zenexity
 * http://github.com/gre/HTML5-File-Uploader
 * 
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 */
(function(){
  
  var PostFile = function() {
    
    var isSupported_FormData = typeof(FormData)!="undefined";
    var isSupported_DragAndDrop = ('draggable' in document.createElement('span'));
    
    /**
     * file can be :
     *  - an input[type=file]
     *  - a DataTransfert
     */
    var upload = function(file, form) {
      
      var beforeUpload = function(){
          $('.message', form).empty();
          $('.showWhenUploadingBegin', form).show();
      };
      var onSuccessUpload = function(responseText, readyState){
        if(readyState===4 || readyState==="success"/* for $.ajaxSubmit */ ) {
          $('input',form).val('');
          $('.hideWhenUploadingEnd', form).hide();
          $('.message', form).empty().append(responseText);
        }
      };
      
      if(file instanceof jQuery)
        file = file[0];
      
      var name = $('input',form).attr('name') ||  $('.dropzone',form).attr('name') || 'file';
      var method = form.attr('method') || 'POST';
      var action = form.attr('action') || window.location.pathname;
      
      if(isSupported_FormData) {
        // FormData supported
        var formdata = new FormData();
        formdata.append(name, file);
        beforeUpload();
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
          onSuccessUpload(xhr.responseText, xhr.readyState);
        };
        xhr.open(method, action);
        xhr.send(formdata);
      }
      else {
        $(form).ajaxSubmit({
          beforeSubmit: beforeUpload,
          success: onSuccessUpload
        });
      }
      
    };
    
    return {
      
      init: function() {
        
        $('.postFile form').each(function(){
          var form = $(this);
          
          $('.removeIfAsynchronous').remove();
          
          $('input', form).change(function(){
            upload(this.files ? this.files[0] : null, form);
          });
          
          if(isSupported_DragAndDrop) {
            $('.hideIfDropSupported', form).hide();
            $('.dropzone', form).each(function(){
                
                //$(this).droppable( // THERE IS A BUG, TEMPORARY COMMENT AND REPLACED BY .dropzone selector
                $('.dropzone').droppable(
                    $(this).attr('accept'),
                    // Drag enter
                    function() {
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

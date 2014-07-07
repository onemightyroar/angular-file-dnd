(function() {
  'use strict';
  angular.module('omr.angularFileDnD', []).directive('fileDropzone', function() {
    require('^form');
    return {
      restrict: 'A',
      scope: {
        file: '=',
        fileName: '=',
        dropzoneHoverClass: '@'
      },
      link: function(scope, element, attrs, ctrl) {
        var checkSize, getDataTransfer, isTypeValid, processDragOverOrEnter, validMimeTypes;
        getDataTransfer = function(event) {
          var dataTransfer;
          return dataTransfer = event.dataTransfer || event.originalEvent.dataTransfer;
        };
        processDragOverOrEnter = function(event) {
          if (event) {
            element.addClass(scope.dropzoneHoverClass);
            if (event.preventDefault) {
              event.preventDefault();
            }
            if (event.stopPropagation) {
              return false;
            }
          }
          getDataTransfer(event).effectAllowed = 'copy';
          return false;
        };
        validMimeTypes = attrs.fileDropzone;
        checkSize = function(size) {
          var _ref;
          if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
            return true;
          } else {
            alert("File must be smaller than " + attrs.maxFileSize + " MB");
            return false;
          }
        };
        isTypeValid = function(type) {
          if ((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
            return true;
          } else {
            alert("Invalid file type.  File must be one of following types " + validMimeTypes);
            return false;
          }
        };
        element.bind('dragover', processDragOverOrEnter);
        element.bind('dragenter', processDragOverOrEnter);
        element.bind('dragleave', function() {
          return element.removeClass(scope.dropzoneHoverClass);
        });
        return element.bind('drop', function(event) {
          var file, name, reader, size, type;
          if (event != null) {
            event.preventDefault();
          }
          element.removeClass(scope.dropzoneHoverClass);
          reader = new FileReader();
          reader.onload = function(evt) {
            if (checkSize(size) && isTypeValid(type)) {
              scope.$apply(function() {
                scope.file = evt.target.result;
                if (angular.isString(scope.fileName)) {
                  return scope.fileName = name;
                }
              });
              ctrl.$pristine = false;
              ctrl.$dirty = true;
              return scope.$emit('file-dropzone-drop-event', {
                file: scope.file,
                type: type,
                name: name,
                size: size
              });
            }
          };
          file = getDataTransfer(event).files[0];
          name = file.name;
          type = file.type;
          size = file.size;
          reader.readAsDataURL(file);
          return false;
        });
      }
    };
  });

}).call(this);

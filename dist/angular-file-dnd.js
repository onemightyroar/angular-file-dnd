(function() {
  'use strict';
  angular.module('omr.angularFileDnD', []).directive('fileDropzone', function() {
    return {
      require: '^?form',
      restrict: 'A',
      scope: false,
      link: function(scope, element, attrs, form) {
        var checkSize, getDataTransfer, isTypeValid, processDragOverOrEnter, setScopeVar, validMimeTypes;
        getDataTransfer = function(event) {
          var dataTransfer;
          return dataTransfer = event.dataTransfer || event.originalEvent.dataTransfer;
        };
        processDragOverOrEnter = function(event) {
          if (!scope.$eval(attrs.dropzoneEnabled)) {
            return true;
          }
          if (event) {
            element.addClass(attrs.dropzoneHoverClass);
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
        attrs.dropzoneHoverClass = attrs.dropzoneHoverClass || 'file-droping';
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
        setScopeVar = function(name, value) {
          var objName, tmp, varName;
          if (name.indexOf('.') === -1) {
            return scope[name] = value;
          } else {
            tmp = name.split('.');
            objName = tmp.slice(0, -1).join('.');
            varName = tmp[tmp.length - 1];
            return scope.$eval(objName)[varName] = value;
          }
        };
        element.bind('dragover', processDragOverOrEnter);
        element.bind('dragenter', processDragOverOrEnter);
        element.bind('dragleave', function() {
          return element.removeClass(attrs.dropzoneHoverClass);
        });
        return element.bind('drop', function(event) {
          var file, name, reader, size, type;
          if (!scope.$eval(attrs.dropzoneEnabled)) {
            return true;
          }
          if (event != null) {
            event.preventDefault();
          }
          element.removeClass(attrs.dropzoneHoverClass);
          reader = new FileReader();
          reader.onload = function(evt) {
            if (checkSize(size) && isTypeValid(type)) {
              scope.$apply(function() {
                setScopeVar(attrs.file, evt.target.result);
                if (angular.isString(attrs.fileName)) {
                  return setScopeVar(attrs.fileName, name);
                }
              });
              if (form) {
                form.$setDirty();
              }
              return scope.$emit('file-dropzone-drop-event', {
                file: scope[attrs.file],
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
          if (!angular.isDefined(attrs.asFile)) {
            reader.readAsDataURL(file);
          } else {
            scope.$apply(function() {
              setScopeVar(attrs.file, file);
              if (angular.isString(attrs.fileName)) {
                return setScopeVar(attrs.fileName, name);
              }
            });
            if (form) {
              form.$setDirty();
            }
            scope.$emit('file-dropzone-drop-event', {
              file: file
            });
          }
          return false;
        });
      }
    };
  });

}).call(this);

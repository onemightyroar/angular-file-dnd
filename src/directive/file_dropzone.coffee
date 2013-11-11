'use strict';

angular.module('omr.angularFileDnD', [])
  .directive('fileDropzone', () ->
    restrict: 'A'
    scope: {
      file: '='
      fileName: '='
    }
    link: (scope, element, attrs) ->

      getDataTransfer = (event) ->
        dataTransfer = event.dataTransfer || event.originalEvent.dataTransfer

      # function to prevent default behavior (browser loading image)
      processDragOverOrEnter = (event) ->
        event?.preventDefault()
        getDataTransfer(event).effectAllowed = 'copy'
        false

      validMimeTypes = attrs.fileDropzone

      # if the max file size is provided and the size of dropped file is greater than it,
      # it's an invalid file and false is returned
      checkSize = (size) ->
        if attrs.maxFileSize in [undefined, ''] or (size / 1024) / 1024 < attrs.maxFileSize
          true
        else
          alert "File must be smaller than #{attrs.maxFileSize} MB"
          false

      isTypeValid = (type) ->
        if validMimeTypes in [undefined, ''] or validMimeTypes.indexOf(type) > -1
          true
        else
          # return true if no mime types are provided
          alert "Invalid file type.  File must be one of following types #{validMimeTypes}"
          false

      # for dragover and dragenter (IE) we stop the browser from handling the
      # event and specify copy as the allowable effect
      element.bind 'dragover', processDragOverOrEnter
      element.bind 'dragenter', processDragOverOrEnter

      # on drop events we stop browser and read the dropped file via the FileReader
      # the resulting droped file is bound to the image property of the scope of this directive
      element.bind 'drop', (event) ->
        event?.preventDefault()
        reader = new FileReader()
        reader.onload = (evt) ->

          if checkSize(size) and isTypeValid(type)
            scope.$apply ->
              scope.file = evt.target.result
              scope.fileName = name if angular.isString scope.fileName
            scope.$emit 'file-dropzone-drop-event', {file: scope.file, type: type, name: name, size: size}

        file = getDataTransfer(event).files[0]
        name = file.name
        type = file.type
        size = file.size
        reader.readAsDataURL file
        false
  )
'use strict';

angular.module('omr.angularFileDnD', [])
  .directive('fileDropzone', () ->
    require: '^?form'
    restrict: 'A'
    scope: false,
    link: (scope, element, attrs, form) ->

      getDataTransfer = (event) ->
        dataTransfer = event.dataTransfer || event.originalEvent.dataTransfer

      # function to prevent default behavior (browser loading image)
      processDragOverOrEnter = (event) ->
        if !scope.$eval(attrs.dropzoneEnabled)
          return true

        if event
          element.addClass attrs.dropzoneHoverClass
          event.preventDefault()  if event.preventDefault
          return false if event.stopPropagation
        getDataTransfer(event).effectAllowed = 'copy'
        false

      attrs.dropzoneHoverClass = attrs.dropzoneHoverClass || 'file-droping';
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

      setScopeVar = (name, value) ->
        if name.indexOf('.') == -1
          scope[name] = value
        else
          tmp = name.split('.')
          objName = tmp.slice(0, -1).join('.')
          varName = tmp[tmp.length - 1]
          scope.$eval(objName)[varName] = value

      # for dragover and dragenter (IE) we stop the browser from handling the
      # event and specify copy as the allowable effect
      element.bind 'dragover', processDragOverOrEnter
      element.bind 'dragenter', processDragOverOrEnter
      element.bind 'dragleave', ->
        element.removeClass attrs.dropzoneHoverClass

      # on drop events we stop browser and read the dropped file via the FileReader
      # the resulting droped file is bound to the image property of the scope of this directive
      element.bind 'drop', (event) ->
        if !scope.$eval(attrs.dropzoneEnabled)
          return true

        event?.preventDefault()
        element.removeClass attrs.dropzoneHoverClass
        reader = new FileReader()
        reader.onload = (evt) ->

          if checkSize(size) and isTypeValid(type)
            scope.$apply ->
              setScopeVar(attrs.file, evt.target.result)
              setScopeVar(attrs.fileName, name) if angular.isString attrs.fileName
            if form
              form.$setDirty() #notify the form of this change
            scope.$emit 'file-dropzone-drop-event', {file: scope[attrs.file], type: type, name: name, size: size}

        file = getDataTransfer(event).files[0]
        name = file.name
        type = file.type
        size = file.size
        if !angular.isDefined(attrs.asFile)
          reader.readAsDataURL file
        else
          scope.$apply ->
            setScopeVar(attrs.file, file)
            setScopeVar(attrs.fileName, name) if angular.isString attrs.fileName
          if form
              form.$setDirty() #notify the form of this change
          scope.$emit 'file-dropzone-drop-event', {file: file}          

        false
  )

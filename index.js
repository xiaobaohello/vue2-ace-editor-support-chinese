var ace = require('brace')

require(['emmet/emmet'], function (data) {
  window.emmet = data.emmet
})

module.exports = {
  template: '<div :style="{height: height ? px(height) : \'100%\',width: width ? px(width) : \'100%\'}"></div>',
  props: {
    value: {
      type: String,
      required: true,
    },
    lang: String,
    theme: String,
    autoComplete: Boolean,
    height: true,
    width: true,
  },
  data: function () {
    return {
      editor: null,
      contentBackup: '',
    }
  },
  methods: {
    px: function (n) {
      if (/^\d*$/.test(n)) {
        return n + 'px'
      }
      return n
    },
  },
  watch: {
    value: function (val) {
      if (this.contentBackup !== val)
        this.editor.setValue(val, 1)
    },
    lang: function (val) {
      if (val && this.editor) {
        this.editor.getSession().setMode('ace/mode/' + val)
      }
    },
  },
  mounted: function () {
    let _this = this
    let vm = this
    let lang = this.lang || 'text'
    let theme = this.theme || 'chrome'
    let autoComplete = this.autoComplete || false
    
    require('brace/ext/emmet')
  
    let editor = vm.editor = ace.edit(this.$el)
    
    _this.$emit('init', editor)
    
    editor.$blockScrolling = Infinity
    editor.setOption('enableEmmet', true)
    editor.getSession().setMode('ace/mode/' + lang)
    editor.setTheme('ace/theme/' + theme)
    editor.setValue(this.value, 1)
    this.$set(this, 'contentBackup', this.value)
    // set autoComplete
    if (autoComplete) {
      let staticWordCompleter = {
        getCompletions: function (editor, session, pos, prefix, callback) {
          _this.$emit('setCompletions', editor, session, pos, prefix, callback)
        },
      }
      editor.completers = [staticWordCompleter]
      
      editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,//只能补全
      })
    }
    
    editor.on('change', function () {
      let content = editor.getValue()
      vm.$emit('input', content)
      vm.contentBackup = content
    })
  },
}

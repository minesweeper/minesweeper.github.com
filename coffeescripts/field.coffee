class window.Field
  constructor: (@opts) ->

  render: ->
    template = """
    <table>
    {{#rows}}
      <tr>
      {{#cells}}
        <td class=\"{{state}}\" id=\"r{{row}}c{{col}}\"></td>
      {{/cells}}
      </tr>
    {{/rows}}
    </table>
    """
    Mustache.to_html template,
      rows: ({ cells: ({ state:'unclicked', row: row, col: col } for row in [1..@opts.width]) } for col in [1..@opts.height])

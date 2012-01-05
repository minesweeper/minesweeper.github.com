(function() {
  var current, left_clicked, marked_mouseup, reveal_unclicked_cell, set_marked_to_uncertain, set_uncertain_to_unclicked, set_unclicked_to_marked, uncertain_mouseup, unclicked_mouseup;

  current = null;

  left_clicked = function(event) {
    return event.which === 1;
  };

  reveal_unclicked_cell = function(element) {
    var adjacentCount, col, match, row;
    match = /r(\d+)c(\d+)/.exec(element.attr('id'));
    row = parseInt(match[1]);
    col = parseInt(match[2]);
    if (current.hasMine(row, col)) {
      return element.attr('class', 'mine');
    } else {
      adjacentCount = current.adjacentCount(row, col);
      if (adjacentCount === 0) {
        _.each(current.neighbours(row, col), function(cell) {
          row = cell[0];
          col = cell[1];
          return $("#r" + row + "c" + col).trigger({
            type: 'mouseup',
            which: 1
          });
        });
      }
      return element.attr('class', "mines" + adjacentCount);
    }
  };

  set_unclicked_to_marked = function(element) {
    element.attr('class', 'marked');
    return element.bind('mouseup', marked_mouseup);
  };

  set_marked_to_uncertain = function(element) {
    element.attr('class', 'uncertain');
    return element.bind('mouseup', uncertain_mouseup);
  };

  set_uncertain_to_unclicked = function(element) {
    element.attr('class', 'unclicked');
    return element.bind('mouseup', unclicked_mouseup);
  };

  marked_mouseup = function(event) {
    if (!left_clicked(event)) {
      $(this).unbind(event);
      return set_marked_to_uncertain($(this));
    }
  };

  uncertain_mouseup = function(event) {
    if (!left_clicked(event)) {
      $(this).unbind(event);
      return set_uncertain_to_unclicked($(this));
    }
  };

  unclicked_mouseup = function(event) {
    $(this).unbind(event);
    if (left_clicked(event)) {
      return reveal_unclicked_cell($(this));
    } else {
      return set_unclicked_to_marked($(this));
    }
  };

  window.Minesweeper = {
    create: function(locator, opts) {
      current = new Field(opts);
      $(locator).html(current.render());
      $('.unclicked').bind('contextmenu', function() {
        return false;
      });
      return $('.unclicked').bind('mouseup', unclicked_mouseup);
    }
  };

}).call(this);

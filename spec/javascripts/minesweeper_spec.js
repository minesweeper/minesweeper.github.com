(function() {

  describe('minesweeper', function() {
    var cell_state, click_status, givenField, left_click, remaining_mines, right_click;
    right_click = function(row, col) {
      return $("#r" + row + "c" + col).trigger({
        type: 'mouseup',
        which: 2
      });
    };
    left_click = function(row, col) {
      return $("#r" + row + "c" + col).trigger({
        type: 'mouseup',
        which: 1
      });
    };
    click_status = function() {
      return $("#status").trigger({
        type: 'mouseup'
      });
    };
    cell_state = function(row, col) {
      return $("#r" + row + "c" + col).attr('class');
    };
    remaining_mines = function() {
      var lcd_digit;
      lcd_digit = function(exponent) {
        var match;
        match = /lcd(\d)/.exec($("#minesRemaining" + exponent + "s").attr('class'));
        return match[1];
      };
      return parseInt("" + (lcd_digit(100)) + (lcd_digit(10)) + (lcd_digit(1)));
    };
    givenField = function(s) {
      var lastrow, lines, mines;
      mines = [];
      lines = s.split("\n");
      lastrow = null;
      _.each(lines, function(line, row) {
        lastrow = line.split(" ");
        return _.each(lastrow, function(char, col) {
          if (char === '*') return mines.push([row, col]);
        });
      });
      return Minesweeper.create('#jasmine_content', {
        cols: lastrow.length,
        rows: lines.length,
        mines: mines,
        mineCount: mines.length
      });
    };
    it('should cycle through marked to uncertain to unclicked on right click', function() {
      givenField(".");
      expect(cell_state(0, 0)).toEqual('unclicked');
      right_click(0, 0);
      expect(cell_state(0, 0)).toEqual('marked');
      right_click(0, 0);
      expect(cell_state(0, 0)).toEqual('uncertain');
      right_click(0, 0);
      return expect(cell_state(0, 0)).toEqual('unclicked');
    });
    it('should end the game when a cell containing mine is left clicked', function() {
      givenField("*");
      left_click(0, 0);
      return expect(cell_state(0, 0)).toEqual('mine');
    });
    it('should reveal cell with no adjacent mines', function() {
      givenField(".");
      left_click(0, 0);
      return expect(cell_state(0, 0)).toEqual('mines0');
    });
    it('should reveal cell with one adjacent mine', function() {
      givenField(". *");
      left_click(0, 0);
      return expect(cell_state(0, 0)).toEqual('mines1');
    });
    it('should reveal cell with two adjacent mines', function() {
      givenField(". *\n* .");
      left_click(0, 0);
      return expect(cell_state(0, 0)).toEqual('mines2');
    });
    it('should reveal cell with three adjacent mines', function() {
      givenField(". *\n* *");
      left_click(0, 0);
      return expect(cell_state(0, 0)).toEqual('mines3');
    });
    it('should reveal cell with four adjacent mines', function() {
      givenField("* . *\n. * *");
      left_click(0, 1);
      return expect(cell_state(0, 1)).toEqual('mines4');
    });
    it('should reveal cell with five adjacent mines', function() {
      givenField("* . *\n* * *");
      left_click(0, 1);
      return expect(cell_state(0, 1)).toEqual('mines5');
    });
    it('should reveal cell with six adjacent mines', function() {
      givenField("* . .\n* . *\n* * *");
      left_click(1, 1);
      return expect(cell_state(1, 1)).toEqual('mines6');
    });
    it('should reveal cell with six adjacent mines', function() {
      givenField("* * .\n* . *\n* * *");
      left_click(1, 1);
      return expect(cell_state(1, 1)).toEqual('mines7');
    });
    it('should reveal cell with six adjacent mines', function() {
      givenField("* * *\n* . *\n* * *");
      left_click(1, 1);
      return expect(cell_state(1, 1)).toEqual('mines8');
    });
    it('should reveal adjacent cells when there are no adjacent mines', function() {
      givenField(". .\n. .\n* .");
      left_click(0, 0);
      expect(cell_state(0, 0)).toEqual('mines0');
      expect(cell_state(0, 1)).toEqual('mines0');
      expect(cell_state(1, 0)).toEqual('mines1');
      expect(cell_state(1, 1)).toEqual('mines1');
      return expect(cell_state(2, 1)).toEqual('unclicked');
    });
    it('should reset game when status button is clicked', function() {
      givenField(".");
      expect(cell_state(0, 0)).toEqual('unclicked');
      left_click(0, 0);
      expect(cell_state(0, 0)).toEqual('mines0');
      click_status();
      return expect(cell_state(0, 0)).toEqual('unclicked');
    });
    it('should display initial mine count', function() {
      givenField("*");
      return expect(remaining_mines()).toEqual(1);
    });
    return it('should decrement mine count when a mine is marked', function() {
      givenField("* *");
      expect(remaining_mines()).toEqual(2);
      right_click(0, 0);
      expect(remaining_mines()).toEqual(1);
      right_click(0, 1);
      return expect(remaining_mines()).toEqual(0);
    });
  });

}).call(this);

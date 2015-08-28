var Commander = function () {
  this.done = [];
  this.undone = [];
  this.commands = {};
};

Commander.argsToArray = function (args) {
  var _args = [];

  for (var i = 1; i < args.length; i++) {
    _args.push(args[i]);
  };

  return _args;
}

Commander.prototype.do = function (commandName) {
  var doFunction   = this.commands[commandName],
      argumentList = Commander.argsToArray(arguments),
      addToStack   = true;

  try {
    var result = doFunction.apply(null, argumentList);
  } catch (error) {
    console.log("Something went wrong");
    throw error;
  };

  // clear out undone stack when doing something new
  if (this.undone.length) { this.undone = []; };

  this.done.push({
    name: commandName,
    args: argumentList
  });

  return result;
};

Commander.prototype.undo = function () {
  if (this.done.length === 0) { return; }

  var _done             = this.done.pop(),
      _doneFunction     = this.commands[_done.name],
      _undoCommandName  = _doneFunction.undoName,
      _undoArgumentList = _done.args,
      _undoFunction     = this.commands[_undoCommandName];

  this.undone.push({
    name: _undoCommandName,
    args: _undoArgumentList
  });

  return _undoFunction.apply(null, _undoArgumentList);
};

Commander.prototype.redo = function () {
  if (this.undone.length === 0) { return; }

  var _undone         = this.undone.pop(),
      _undoneFunction = this.commands[_undone.name],
      _doCommandName  = _undoneFunction.undoName,
      _doArgumentList = _undone.args,
      _doFunction     = this.commands[_doCommandName];

  this.done.push({
    name: _doCommandName,
    args: _doArgumentList
  });

  return _doFunction.apply(null, _doArgumentList);
};

Commander.verifyPair = function (funcOne, funcTwo) {
  if (funcOne.doName && funcOne.undoName &&
      funcTwo.doName && funcTwo.undoName) {
    return (funcOne.doName === funcTwo.undoName) &&
           (funcTwo.doName === funcOne.undoName);
  } else {
    return false;
  };
};

Commander.prototype.addFunctions = function (doFunc, undoFunc) {
  // only add functions which have been set in opposition to each other
  if (Commander.verifyPair(doFunc, undoFunc)) {
    this.commands[doFunc.doName]   = doFunc;
    this.commands[undoFunc.doName] = undoFunc;
  } else {
    throw new Error("Functions must be passed in matching pairs");
  };

  return this;
};

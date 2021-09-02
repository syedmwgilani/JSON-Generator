

//https://www.json.org/json-en.html
//Values Types: string, number, "true", "false", "null"
function Element(value, valueType = 'string') {
  let self = this;
  self.value = value;
  self.valueType = ko.observable(valueType);
}


//Member: ws string ws ':' element
function Member(name, value, valueType = 'string') {
  let self = this;
  self.name = ko.observable(name);
  self.value = ko.observable(value);

  self.valueType = ko.observable(valueType);

  self.cleanValue = ko.pureComputed(() => {
    let value = null;

    switch (self.valueType()) {
      case 'string':
        value = self.value();
        break;
      case 'number':
        value = Number.parseFloat(self.value());
        break;
      case 'boolean':
        value = self.value() ? true : false;
        break;
      case 'null':
        value = null;
        break;
      default:
        console.error('Error: valueType not declared.');
    }

    return value;
  });

  self.valueTemplate = function() {
    return self.valueType();
  }

  self.valueTemplateAfterRender = function(element, kvData) {
    self.value(self.cleanValue());
  }

  self.displayModal = ko.pureComputed(() => {
    if (self.valueType() === 'object') {
      return true;
    }
    return false;
  })
  self.modalTemplate = ko.observable('modal');
}  //  Member


let vm = new function () {
  let self = this;

  self.valueTypes = ['string', 'number', 'boolean', 'null'];

  self.jsonBox = ko.observable('');
  self.members = ko.observableArray([
    new Member()
  ]);

  self.addMember = function() {
    self.members.push(new Member());
  }

  self.removeMember = function(member) {
    self.members.remove(member);
  }

  self.generateJson = function() {
    let obj = {};

    self.members().forEach( m => {
      let name = m.name() ? m.name() : '';
      obj[name] = m.cleanValue();
    })

    //TODO setting to (omit or keep) -> null, NaN, empty string
    let json = JSON.stringify(obj);
    self.jsonBox(json);
    copyTextClipboard(json);
  }

  self.copyTextMessage = ko.observable(false);

  self.changeColor = function() {
    console.log('hello')
  }
}  //  vm


ko.applyBindings(vm)


async function copyTextClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Text copied to clipboard: ', text);
    vm.copyTextMessage(true)
    setTimeout( function(){ vm.copyTextMessage(false) }, 1000)
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}


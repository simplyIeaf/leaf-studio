var state = {
  objects: [],
  selected: null,
  clipboard: null,
  undoStack: [],
  redoStack: [],
  currentTool: 'select',
  settings: {},
  pubTarget: 'user',
  nextId: 1,
  explorerFilter: '',
  openScriptObj: null,
};

var OBJECT_DEFS = [
  { name:'Part',            cat:'parts',   props: partProps() },
  { name:'WedgePart',       cat:'parts',   props: partProps() },
  { name:'CornerWedgePart', cat:'parts',   props: partProps() },
  { name:'CylinderPart',    cat:'parts',   props: partProps() },
  { name:'TrussPart',       cat:'parts',   props: partProps() },
  { name:'SpawnLocation',   cat:'parts',   props: partProps() },
  { name:'Model',           cat:'parts',   props: modelProps() },
  { name:'Folder',          cat:'parts',   props: baseProps() },
  { name:'Tool',            cat:'parts',   props: toolProps() },
  { name:'Script',          cat:'scripts', props: scriptProps('Script') },
  { name:'LocalScript',     cat:'scripts', props: scriptProps('LocalScript') },
  { name:'ModuleScript',    cat:'scripts', props: scriptProps('ModuleScript') },
  { name:'RemoteEvent',     cat:'scripts', props: baseProps() },
  { name:'RemoteFunction',  cat:'scripts', props: baseProps() },
  { name:'BindableEvent',   cat:'scripts', props: baseProps() },
  { name:'BindableFunction',cat:'scripts', props: baseProps() },
  { name:'ScreenGui',       cat:'gui',     props: guiProps() },
  { name:'Frame',           cat:'gui',     props: guiFrameProps() },
  { name:'TextLabel',       cat:'gui',     props: guiTextProps() },
  { name:'TextButton',      cat:'gui',     props: guiTextProps() },
  { name:'TextBox',         cat:'gui',     props: guiTextProps() },
  { name:'ImageLabel',      cat:'gui',     props: guiFrameProps() },
  { name:'ImageButton',     cat:'gui',     props: guiFrameProps() },
  { name:'ScrollingFrame',  cat:'gui',     props: guiFrameProps() },
  { name:'BillboardGui',    cat:'gui',     props: guiProps() },
  { name:'SurfaceGui',      cat:'gui',     props: guiProps() },
  { name:'Part (Weld)',     cat:'physics', props: partProps() },
  { name:'WeldConstraint',  cat:'physics', props: constraintProps() },
  { name:'HingeConstraint', cat:'physics', props: constraintProps() },
  { name:'RodConstraint',   cat:'physics', props: constraintProps() },
  { name:'RopeConstraint',  cat:'physics', props: constraintProps() },
  { name:'SpringConstraint',cat:'physics', props: constraintProps() },
  { name:'LinearVelocity',  cat:'physics', props: forceProps() },
  { name:'AngularVelocity', cat:'physics', props: forceProps() },
  { name:'VectorForce',     cat:'physics', props: forceProps() },
  { name:'Torque',          cat:'physics', props: forceProps() },
  { name:'BodyVelocity',    cat:'physics', props: forceProps() },
  { name:'BodyPosition',    cat:'physics', props: forceProps() },
  { name:'BodyGyro',        cat:'physics', props: forceProps() },
  { name:'Attachment',      cat:'physics', props: baseProps() },
  { name:'ClickDetector',   cat:'physics', props: clickProps() },
  { name:'ProximityPrompt', cat:'physics', props: promptProps() },
  { name:'Lighting',        cat:'lighting',props: lightingProps() },
  { name:'PointLight',      cat:'lighting',props: lightProps() },
  { name:'SpotLight',       cat:'lighting',props: lightProps() },
  { name:'SurfaceLight',    cat:'lighting',props: lightProps() },
  { name:'Sky',             cat:'lighting',props: skyProps() },
  { name:'Atmosphere',      cat:'lighting',props: atmosphereProps() },
  { name:'ColorCorrection', cat:'lighting',props: colorCorrProps() },
  { name:'BlurEffect',      cat:'lighting',props: blurProps() },
  { name:'Sound',           cat:'sound',   props: soundProps() },
  { name:'SoundGroup',      cat:'sound',   props: baseProps() },
  { name:'ChorusSoundEffect',cat:'sound',  props: baseProps() },
  { name:'EchoSoundEffect',  cat:'sound',  props: baseProps() },
  { name:'ReverbSoundEffect',cat:'sound',  props: baseProps() },
  { name:'PitchShiftSoundEffect',cat:'sound',props: baseProps() },
  { name:'Fire',            cat:'fx',      props: fireProps() },
  { name:'Smoke',           cat:'fx',      props: smokeProps() },
  { name:'Sparkles',        cat:'fx',      props: sparkleProps() },
  { name:'ParticleEmitter', cat:'fx',      props: particleProps() },
  { name:'Beam',            cat:'fx',      props: baseProps() },
  { name:'Trail',           cat:'fx',      props: baseProps() },
  { name:'SelectionBox',    cat:'fx',      props: baseProps() },
  { name:'StringValue',     cat:'values',  props: valueProps('string','') },
  { name:'IntValue',        cat:'values',  props: valueProps('number',0) },
  { name:'NumberValue',     cat:'values',  props: valueProps('number',0) },
  { name:'BoolValue',       cat:'values',  props: valueProps('boolean',false) },
  { name:'Vector3Value',    cat:'values',  props: baseProps() },
  { name:'Color3Value',     cat:'values',  props: baseProps() },
  { name:'ObjectValue',     cat:'values',  props: baseProps() },
];

function baseProps() {
  return [
    { section:'Data', rows:[
      { name:'Name', type:'string', val:'Object' },
      { name:'ClassName', type:'readonly', val:'' },
    ]},
    { section:'Tags', rows:[
      { name:'Archivable', type:'boolean', val:true },
    ]},
  ];
}

function partProps() {
  return [
    { section:'Appearance', rows:[
      { name:'BrickColor', type:'string', val:'Medium stone grey' },
      { name:'Color',      type:'color',  val:'#9b9b9b' },
      { name:'Material',   type:'select', val:'SmoothPlastic', opts:['SmoothPlastic','Plastic','Wood','WoodPlanks','Brick','Cobblestone','Concrete','CorrodedMetal','DiamondPlate','Fabric','Foil','Grass','Ice','Marble','Metal','Neon','Pebble','Rock','Sand','Slate','SmoothPlastic'] },
      { name:'Transparency', type:'number', val:0 },
      { name:'Reflectance',  type:'number', val:0 },
      { name:'CastShadow',   type:'boolean',val:true },
    ]},
    { section:'Data', rows:[
      { name:'Name',       type:'string', val:'Part' },
      { name:'ClassName',  type:'readonly',val:'' },
      { name:'Anchored',   type:'boolean', val:false },
      { name:'CanCollide', type:'boolean', val:true },
      { name:'CanQuery',   type:'boolean', val:true },
      { name:'CanTouch',   type:'boolean', val:true },
      { name:'Locked',     type:'boolean', val:false },
      { name:'Massless',   type:'boolean', val:false },
    ]},
    { section:'Transform', rows:[
      { name:'Size.X',     type:'number',  val:4 },
      { name:'Size.Y',     type:'number',  val:1.2 },
      { name:'Size.Z',     type:'number',  val:2 },
      { name:'Position.X', type:'number',  val:0 },
      { name:'Position.Y', type:'number',  val:0 },
      { name:'Position.Z', type:'number',  val:0 },
    ]},
    { section:'Tags', rows:[{ name:'Archivable', type:'boolean', val:true }]},
  ];
}

function modelProps() {
  return [
    { section:'Data', rows:[
      { name:'Name',  type:'string', val:'Model' },
      { name:'ClassName', type:'readonly', val:'' },
      { name:'Scale', type:'number', val:1 },
    ]},
    { section:'Tags', rows:[{ name:'Archivable', type:'boolean', val:true }]},
  ];
}

function scriptProps(cls) {
  return [
    { section:'Data', rows:[
      { name:'Name',     type:'string',  val:cls },
      { name:'ClassName',type:'readonly',val:'' },
      { name:'Disabled', type:'boolean', val:false },
      { name:'Source',   type:'code',    val:cls==='Script'?'-- ServerScript\n\n':cls==='LocalScript'?'-- LocalScript\n\n':'-- ModuleScript\nlocal M = {}\n\nreturn M\n' },
    ]},
  ];
}

function guiProps() {
  return [
    { section:'Data', rows:[
      { name:'Name',    type:'string',  val:'ScreenGui' },
      { name:'ClassName',type:'readonly',val:'' },
      { name:'Enabled', type:'boolean', val:true },
      { name:'ResetOnSpawn', type:'boolean', val:true },
      { name:'DisplayOrder', type:'number', val:0 },
    ]},
  ];
}

function guiFrameProps() {
  return [
    { section:'Appearance', rows:[
      { name:'BackgroundColor3', type:'color', val:'#ffffff' },
      { name:'BackgroundTransparency', type:'number', val:0 },
      { name:'BorderSizePixel', type:'number', val:1 },
      { name:'Visible', type:'boolean', val:true },
    ]},
    { section:'Data', rows:[
      { name:'Name', type:'string', val:'Frame' },
      { name:'ClassName', type:'readonly', val:'' },
      { name:'ZIndex', type:'number', val:1 },
    ]},
    { section:'Size', rows:[
      { name:'Size.X.Scale', type:'number', val:0 },
      { name:'Size.X.Offset', type:'number', val:100 },
      { name:'Size.Y.Scale', type:'number', val:0 },
      { name:'Size.Y.Offset', type:'number', val:100 },
      { name:'Position.X.Scale', type:'number', val:0 },
      { name:'Position.X.Offset', type:'number', val:0 },
      { name:'Position.Y.Scale', type:'number', val:0 },
      { name:'Position.Y.Offset', type:'number', val:0 },
    ]},
  ];
}

function guiTextProps() {
  var base = guiFrameProps();
  base.push({ section:'Text', rows:[
    { name:'Text', type:'string', val:'Label' },
    { name:'TextColor3', type:'color', val:'#ffffff' },
    { name:'TextSize', type:'number', val:14 },
    { name:'TextWrapped', type:'boolean', val:false },
    { name:'TextXAlignment', type:'select', val:'Center', opts:['Left','Center','Right'] },
    { name:'TextYAlignment', type:'select', val:'Center', opts:['Top','Center','Bottom'] },
    { name:'Font', type:'select', val:'GothamMedium', opts:['GothamMedium','Gotham','Arial','ArialBold','Code','Highway','Roboto','RobotoBold','RobotoMono','SourceSans','SourceSansBold'] },
  ]});
  return base;
}

function lightingProps() {
  return [
    { section:'Appearance', rows:[
      { name:'Ambient',      type:'color',  val:'#7f7f7f' },
      { name:'OutdoorAmbient',type:'color', val:'#7f7f7f' },
      { name:'Brightness',   type:'number', val:1 },
      { name:'ColorShift_Bottom', type:'color', val:'#000000' },
      { name:'ColorShift_Top',    type:'color', val:'#000000' },
      { name:'FogColor',     type:'color',  val:'#c8c8c8' },
      { name:'FogEnd',       type:'number', val:100000 },
      { name:'FogStart',     type:'number', val:0 },
      { name:'ShadowSoftness',type:'number',val:0.2 },
      { name:'GeographicLatitude',type:'number',val:41.7 },
      { name:'TimeOfDay',    type:'string', val:'14:00:00' },
    ]},
    { section:'Data', rows:[
      { name:'Name', type:'readonly', val:'Lighting' },
      { name:'ClassName', type:'readonly', val:'Lighting' },
    ]},
  ];
}

function lightProps() {
  return [
    { section:'Light', rows:[
      { name:'Brightness', type:'number', val:1 },
      { name:'Color',      type:'color',  val:'#ffffff' },
      { name:'Enabled',    type:'boolean',val:true },
      { name:'Range',      type:'number', val:16 },
    ]},
    { section:'Data', rows:[
      { name:'Name', type:'string', val:'PointLight' },
      { name:'ClassName', type:'readonly', val:'' },
    ]},
  ];
}

function soundProps() {
  return [
    { section:'Sound', rows:[
      { name:'SoundId',  type:'string',  val:'rbxassetid://0' },
      { name:'Volume',   type:'number',  val:0.5 },
      { name:'Pitch',    type:'number',  val:1 },
      { name:'Looped',   type:'boolean', val:false },
      { name:'Playing',  type:'boolean', val:false },
      { name:'RollOffMaxDistance', type:'number', val:10000 },
    ]},
    { section:'Data', rows:[
      { name:'Name', type:'string', val:'Sound' },
      { name:'ClassName', type:'readonly', val:'' },
    ]},
  ];
}

function fireProps() {
  return [
    { section:'Fire', rows:[
      { name:'Color',    type:'color',  val:'#ff6600' },
      { name:'SecondaryColor', type:'color', val:'#ff0000' },
      { name:'Heat',     type:'number', val:9 },
      { name:'Size',     type:'number', val:5 },
      { name:'Enabled',  type:'boolean',val:true },
    ]},
    { section:'Data', rows:[{ name:'Name', type:'string', val:'Fire' },{ name:'ClassName', type:'readonly', val:'' }]},
  ];
}

function smokeProps() {
  return [
    { section:'Smoke', rows:[
      { name:'Color',    type:'color',  val:'#808080' },
      { name:'Opacity',  type:'number', val:0.5 },
      { name:'RiseVelocity',type:'number',val:1 },
      { name:'Size',     type:'number', val:1 },
      { name:'Enabled',  type:'boolean',val:true },
    ]},
    { section:'Data', rows:[{ name:'Name', type:'string', val:'Smoke' },{ name:'ClassName', type:'readonly', val:'' }]},
  ];
}

function sparkleProps() {
  return [
    { section:'Sparkles', rows:[
      { name:'SparkleColor', type:'color', val:'#ffffff' },
      { name:'Enabled',      type:'boolean',val:true },
    ]},
    { section:'Data', rows:[{ name:'Name', type:'string', val:'Sparkles' },{ name:'ClassName', type:'readonly', val:'' }]},
  ];
}

function particleProps() {
  return [
    { section:'Emission', rows:[
      { name:'Color',       type:'color',  val:'#ffffff' },
      { name:'Rate',        type:'number', val:20 },
      { name:'Rotation',    type:'number', val:0 },
      { name:'RotSpeed',    type:'number', val:0 },
      { name:'Speed',       type:'number', val:5 },
      { name:'Lifetime',    type:'number', val:5 },
      { name:'LightEmission',type:'number',val:0 },
      { name:'LightInfluence',type:'number',val:1 },
      { name:'Enabled',     type:'boolean',val:true },
    ]},
    { section:'Data', rows:[{ name:'Name', type:'string', val:'ParticleEmitter' },{ name:'ClassName', type:'readonly', val:'' }]},
  ];
}

function skyProps() {
  return [
    { section:'Sky', rows:[
      { name:'SkyboxBk', type:'string', val:'rbxassetid://0' },
      { name:'SkyboxDn', type:'string', val:'rbxassetid://0' },
      { name:'SkyboxFt', type:'string', val:'rbxassetid://0' },
      { name:'SkyboxLf', type:'string', val:'rbxassetid://0' },
      { name:'SkyboxRt', type:'string', val:'rbxassetid://0' },
      { name:'SkyboxUp', type:'string', val:'rbxassetid://0' },
      { name:'StarCount', type:'number', val:3000 },
    ]},
    { section:'Data', rows:[{ name:'Name', type:'string', val:'Sky' },{ name:'ClassName', type:'readonly', val:'' }]},
  ];
}

function atmosphereProps() {
  return [
    { section:'Atmosphere', rows:[
      { name:'Color',    type:'color',  val:'#d9c8a3' },
      { name:'Decay',    type:'color',  val:'#a3785a' },
      { name:'Density',  type:'number', val:0.395 },
      { name:'Glare',    type:'number', val:0 },
      { name:'Haze',     type:'number', val:0 },
      { name:'Offset',   type:'number', val:0 },
    ]},
    { section:'Data', rows:[{ name:'Name', type:'string', val:'Atmosphere' },{ name:'ClassName', type:'readonly', val:'' }]},
  ];
}

function colorCorrProps() {
  return [
    { section:'Color Correction', rows:[
      { name:'Brightness', type:'number', val:0 },
      { name:'Contrast',   type:'number', val:0 },
      { name:'Saturation', type:'number', val:0 },
      { name:'TintColor',  type:'color',  val:'#ffffff' },
      { name:'Enabled',    type:'boolean',val:true },
    ]},
    { section:'Data', rows:[{ name:'Name', type:'string', val:'ColorCorrectionEffect' },{ name:'ClassName', type:'readonly', val:'' }]},
  ];
}

function blurProps() {
  return [
    { section:'Blur', rows:[
      { name:'Size',    type:'number',  val:24 },
      { name:'Enabled', type:'boolean', val:true },
    ]},
    { section:'Data', rows:[{ name:'Name', type:'string', val:'BlurEffect' },{ name:'ClassName', type:'readonly', val:'' }]},
  ];
}

function constraintProps() {
  return [
    { section:'Constraint', rows:[
      { name:'Enabled',  type:'boolean', val:true },
      { name:'Visible',  type:'boolean', val:true },
    ]},
    { section:'Data', rows:[{ name:'Name', type:'string', val:'Constraint' },{ name:'ClassName', type:'readonly', val:'' }]},
  ];
}

function forceProps() {
  return [
    { section:'Force', rows:[
      { name:'Enabled', type:'boolean', val:true },
    ]},
    { section:'Data', rows:[{ name:'Name', type:'string', val:'Force' },{ name:'ClassName', type:'readonly', val:'' }]},
  ];
}

function toolProps() {
  return [
    { section:'Tool', rows:[
      { name:'ToolTip',  type:'string',  val:'' },
      { name:'CanBeDropped', type:'boolean', val:true },
      { name:'RequiresHandle', type:'boolean', val:true },
      { name:'Enabled',  type:'boolean', val:true },
    ]},
    { section:'Data', rows:[
      { name:'Name', type:'string', val:'Tool' },
      { name:'ClassName', type:'readonly', val:'' },
    ]},
  ];
}

function clickProps() {
  return [
    { section:'ClickDetector', rows:[
      { name:'MaxActivationDistance', type:'number', val:32 },
    ]},
    { section:'Data', rows:[{ name:'Name', type:'string', val:'ClickDetector' },{ name:'ClassName', type:'readonly', val:'' }]},
  ];
}

function promptProps() {
  return [
    { section:'ProximityPrompt', rows:[
      { name:'ActionText',  type:'string',  val:'Interact' },
      { name:'ObjectText',  type:'string',  val:'' },
      { name:'HoldDuration',type:'number',  val:0 },
      { name:'MaxActivationDistance', type:'number', val:10 },
      { name:'Enabled',     type:'boolean', val:true },
    ]},
    { section:'Data', rows:[{ name:'Name', type:'string', val:'ProximityPrompt' },{ name:'ClassName', type:'readonly', val:'' }]},
  ];
}

function valueProps(t, v) {
  return [
    { section:'Value', rows:[
      { name:'Value', type:t, val:v },
    ]},
    { section:'Data', rows:[{ name:'Name', type:'string', val:'Value' },{ name:'ClassName', type:'readonly', val:'' }]},
  ];
}

function uid() {
  return 'rbx' + Math.random().toString(36).substr(2,9) + Date.now().toString(36);
}

function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

function getPropVal(obj, name) {
  for (var s of obj.propData) {
    for (var r of s.rows) {
      if (r.name === name) return r.val;
    }
  }
  return '';
}

function setPropVal(obj, name, val) {
  for (var s of obj.propData) {
    for (var r of s.rows) {
      if (r.name === name) { r.val = val; return; }
    }
  }
}

function createObject(className, parentId) {
  var def = OBJECT_DEFS.find(d => d.name === className || d.name.startsWith(className));
  if (!def) def = { name:className, props: baseProps() };

  var propData = deepClone(def.props);
  for (var s of propData) {
    for (var r of s.rows) {
      if (r.name === 'Name') r.val = className;
      if (r.name === 'ClassName') r.val = className;
    }
  }

  var obj = {
    id: uid(),
    className: className,
    propData: propData,
    children: [],
    parentId: parentId || null,
    expanded: false,
  };
  return obj;
}

function findObj(id, list) {
  if (!list) list = state.objects;
  for (var o of list) {
    if (o.id === id) return o;
    var found = findObj(id, o.children);
    if (found) return found;
  }
  return null;
}

function findParent(id, list, parent) {
  if (!list) list = state.objects;
  for (var o of list) {
    if (o.id === id) return parent;
    var found = findParent(id, o.children, o);
    if (found) return found;
  }
  return null;
}

function removeObj(id, list) {
  if (!list) list = state.objects;
  for (var i=0;i<list.length;i++) {
    if (list[i].id === id) { list.splice(i,1); return true; }
    if (removeObj(id, list[i].children)) return true;
  }
  return false;
}

function insertObj(obj, parentId) {
  if (parentId) {
    var par = findObj(parentId);
    if (par) {
      par.children.push(obj);
      par.expanded = true;
      return;
    }
  }
  state.objects.push(obj);
}

function pushUndo() {
  state.undoStack.push(deepClone(state.objects));
  if (state.undoStack.length > 50) state.undoStack.shift();
  state.redoStack = [];
}

function doUndo() {
  if (!state.undoStack.length) return;
  state.redoStack.push(deepClone(state.objects));
  state.objects = state.undoStack.pop();
  state.selected = null;
  renderExplorer();
  renderProperties();
}

function doRedo() {
  if (!state.redoStack.length) return;
  state.undoStack.push(deepClone(state.objects));
  state.objects = state.redoStack.pop();
  state.selected = null;
  renderExplorer();
  renderProperties();
}

function quickInsert(className) {
  closeDropdowns();
  pushUndo();
  var parentId = state.selected;
  var obj = createObject(className, parentId);
  insertObj(obj, parentId);
  state.selected = obj.id;
  renderExplorer();
  renderProperties();
  notify('Inserted ' + className, 'success');
}

function openInsertDialog() {
  closeDropdowns();
  showModal('insert-dialog');
  renderInsertGrid('');
  renderInsertCats();
  document.getElementById('ins-search').value = '';
  setTimeout(() => document.getElementById('ins-search').focus(), 50);
}

var currentInsCat = 'all';
function renderInsertCats() {
  var cats = ['all','parts','scripts','gui','physics','lighting','sound','fx','values'];
  var el = document.getElementById('ins-cats');
  el.innerHTML = cats.map(c => '<div class="ins-cat-tab'+(c===currentInsCat?' active':'')
    +'" onclick="setInsCat(\''+c+'\')">'+(c==='all'?'All':c.charAt(0).toUpperCase()+c.slice(1))+'</div>').join('');
}

function setInsCat(cat) {
  currentInsCat = cat;
  renderInsertCats();
  renderInsertGrid(document.getElementById('ins-search').value);
}

function filterInsertDialog(q) { renderInsertGrid(q); }

function renderInsertGrid(q) {
  var list = OBJECT_DEFS.filter(d => {
    var matchCat = currentInsCat === 'all' || d.cat === currentInsCat;
    var matchQ = !q || d.name.toLowerCase().includes(q.toLowerCase());
    return matchCat && matchQ;
  });
  var el = document.getElementById('ins-grid');
  el.innerHTML = list.map(d =>
    '<div class="ins-obj-btn" onclick="insertFromDialog(\''+d.name+'\')">'
    +'<div class="ins-name">'+d.name+'</div>'
    +'</div>'
  ).join('') || '<div style="color:var(--text-dim);font-size:13px;padding:12px">No objects found.</div>';
}

function insertFromDialog(className) {
  closeModal();
  quickInsert(className);
}

function renderExplorer() {
  var el = document.getElementById('explorer-list');
  var q = state.explorerFilter.toLowerCase();
  el.innerHTML = '';
  var root = document.createElement('div');
  var list = q ? filterTree(state.objects, q) : state.objects;
  for (var obj of list) {
    root.appendChild(makeTreeNode(obj, 0));
  }
  el.appendChild(root);
}

function filterTree(list, q) {
  var out = [];
  for (var o of list) {
    var match = getPropVal(o,'Name').toLowerCase().includes(q) || o.className.toLowerCase().includes(q);
    var kids = filterTree(o.children, q);
    if (match || kids.length) {
      var copy = Object.assign({}, o, { children: kids });
      out.push(copy);
    }
  }
  return out;
}

function makeTreeNode(obj, depth) {
  var name = getPropVal(obj,'Name') || obj.className;
  var wrapper = document.createElement('div');
  wrapper.className = 'tree-node' + (obj.expanded ? ' expanded' : '');
  wrapper.dataset.id = obj.id;
  var row = document.createElement('div');
  row.className = 'tree-row' + (state.selected===obj.id ? ' selected' : '');
  row.dataset.id = obj.id;
  for (var i=0;i<depth;i++) {
    var ind = document.createElement('span');
    ind.className = 'tree-indent';
    row.appendChild(ind);
  }

  var arrow = document.createElement('span');
  arrow.className = 'tree-arrow' + (obj.expanded ? ' open' : '');
  arrow.innerHTML = obj.children.length ? '▶' : '';
  arrow.onclick = function(e) { e.stopPropagation(); toggleExpand(obj.id); };
  row.appendChild(arrow);

  var label = document.createElement('span');
  label.className = 'tree-label';
  label.textContent = name;
  row.appendChild(label);

  row.onclick = function(e) { e.stopPropagation(); selectObj(obj.id); };
  row.ondblclick = function(e) { e.stopPropagation(); handleDblClick(obj); };
  row.oncontextmenu = function(e) { e.preventDefault(); selectObj(obj.id); showCtxMenu(e.clientX, e.clientY); };
  row.draggable = true;
  row.ondragstart = function(e) { e.dataTransfer.setData('text/plain', obj.id); };
  row.ondragover = function(e) { e.preventDefault(); row.classList.add('drag-over'); };
  row.ondragleave = function() { row.classList.remove('drag-over'); };
  row.ondrop = function(e) {
    e.preventDefault(); row.classList.remove('drag-over');
    var srcId = e.dataTransfer.getData('text/plain');
    if (srcId && srcId !== obj.id) moveObjInto(srcId, obj.id);
  };

  wrapper.appendChild(row);

  if (obj.children.length) {
    var kids = document.createElement('div');
    kids.className = 'tree-children';
    for (var child of obj.children) {
      kids.appendChild(makeTreeNode(child, depth+1));
    }
    wrapper.appendChild(kids);
  }

  return wrapper;
}

function moveObjInto(srcId, destId) {
  var src = findObj(srcId);
  if (!src) return;
  if (findObj(destId, src.children)) return;
  pushUndo();
  removeObj(srcId);
  insertObj(src, destId);
  renderExplorer();
}

function toggleExpand(id) {
  var obj = findObj(id);
  if (!obj) return;
  obj.expanded = !obj.expanded;
  renderExplorer();
}

function selectObj(id) {
  state.selected = id;
  renderExplorer();
  renderProperties();
}

function handleDblClick(obj) {
  var cls = obj.className;
  if (cls==='Script'||cls==='LocalScript'||cls==='ModuleScript') {
    openScriptEditorForObj(obj);
  } else {
    renameSelected();
  }
}

function openScriptEditorForObj(obj) {
  state.openScriptObj = obj;
  var src = getPropVal(obj,'Source') || '';
  document.getElementById('script-editor-title').textContent = getPropVal(obj,'Name') || obj.className;
  document.getElementById('script-editor-area').value = src;
  document.getElementById('script-editor').classList.add('visible');
}

function openScriptEditor() {
  if (!state.selected) return;
  var obj = findObj(state.selected);
  if (obj) openScriptEditorForObj(obj);
}

function closeScriptEditor() {
  document.getElementById('script-editor').classList.remove('visible');
  state.openScriptObj = null;
}

function saveScript() {
  if (!state.openScriptObj) return;
  var src = document.getElementById('script-editor-area').value;
  setPropVal(state.openScriptObj,'Source',src);
  notify('Script saved', 'success');
  renderProperties();
}

function scriptEditorKeydown(e) {
  if (e.key==='Tab') {
    e.preventDefault();
    var ta = e.target, s=ta.selectionStart, end=ta.selectionEnd;
    ta.value = ta.value.substring(0,s)+'    '+ta.value.substring(end);
    ta.selectionStart = ta.selectionEnd = s+4;
  }
  if ((e.ctrlKey||e.metaKey)&&e.key==='s') { e.preventDefault(); saveScript(); }
}

function renderProperties() {
  var listEl = document.getElementById('properties-list');
  if (!state.selected) {
    listEl.innerHTML = '';
    return;
  }

  var obj = findObj(state.selected);
  if (!obj) return;

  listEl.innerHTML = '';
  for (var sec of obj.propData) {
    var secDiv = document.createElement('div');
    secDiv.className = 'prop-section';

    var titleDiv = document.createElement('div');
    titleDiv.className = 'prop-section-title';
    titleDiv.innerHTML = '<span class="arr">▼</span> ' + sec.section;
    titleDiv.onclick = (function(sd, td) {
      return function() {
        sd.classList.toggle('collapsed');
        td.querySelector('.arr').textContent = sd.classList.contains('collapsed') ? '▶' : '▼';
      };
    })(secDiv, titleDiv);
    secDiv.appendChild(titleDiv);

    var rows = document.createElement('div');
    rows.className = 'prop-rows';
    for (var row of sec.rows) {
      rows.appendChild(makePropRow(obj, row));
    }
    secDiv.appendChild(rows);
    listEl.appendChild(secDiv);
  }
}

function makePropRow(obj, row) {
  var div = document.createElement('div');
  div.className = 'prop-row';
  var nameEl = document.createElement('div');
  nameEl.className = 'prop-name';
  nameEl.textContent = row.name;
  nameEl.title = row.name;
  div.appendChild(nameEl);

  var valEl = document.createElement('div');
  valEl.className = 'prop-val';

  if (row.type === 'readonly') {
    var sp = document.createElement('span');
    sp.style.cssText = 'font-size:12px;color:var(--text-dim);padding:0 6px;';
    sp.textContent = row.val;
    valEl.appendChild(sp);
  } else if (row.type === 'boolean') {
    var cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.className = 'prop-checkbox';
    cb.checked = row.val;
    cb.onchange = (function(r) { return function() { r.val = this.checked; }; })(row);
    valEl.appendChild(cb);
  } else if (row.type === 'color') {
    var swatch = document.createElement('div');
    swatch.className = 'prop-color-swatch';
    swatch.style.background = row.val;
    var inp = document.createElement('input');
    inp.type = 'color';
    inp.value = row.val;
    inp.style.cssText = 'opacity:0;position:absolute;width:0;height:0;';
    inp.onchange = (function(r,sw) { return function() { r.val=this.value; sw.style.background=this.value; }; })(row,swatch);
    swatch.onclick = function() { inp.click(); };
    var txt = document.createElement('span');
    txt.style.cssText = 'font-size:12px;color:var(--text-head);';
    txt.textContent = row.val;
    inp.oninput = (function(t,r,sw) { return function() { t.textContent=this.value; r.val=this.value; sw.style.background=this.value; }; })(txt,row,swatch);
    valEl.appendChild(swatch);
    valEl.appendChild(inp);
    valEl.appendChild(txt);
  } else if (row.type === 'select') {
    var sel = document.createElement('select');
    sel.className = 'prop-select';
    for (var opt of (row.opts||[])) {
      var o = document.createElement('option');
      o.value = opt;
      o.textContent = opt;
      if (opt===row.val) o.selected=true;
      sel.appendChild(o);
    }
    sel.onchange = (function(r) { return function() { r.val=this.value; }; })(row);
    valEl.appendChild(sel);
  } else if (row.type === 'code') {
    var cbtn = document.createElement('button');
    cbtn.className = 'btn btn-secondary';
    cbtn.style.padding = '4px 8px';
    cbtn.style.fontSize = '11px';
    cbtn.textContent = 'Edit Script';
    cbtn.onclick = function() { openScriptEditor(); };
    valEl.appendChild(cbtn);
  } else {
    var inp = document.createElement('input');
    inp.className = 'prop-input';
    inp.type = row.type==='number' ? 'number' : 'text';
    inp.value = row.val;
    inp.onchange = (function(r, o2) {
      return function() {
        pushUndo();
        var v = r.type==='number' ? parseFloat(this.value)||0 : this.value;
        r.val = v;
        if (r.name==='Name') {
          renderExplorer();
          renderProperties();
        }
      };
    })(row, obj);
    valEl.appendChild(inp);
  }

  div.appendChild(valEl);
  return div;
}

function filterExplorer(q) {
  state.explorerFilter = q;
  renderExplorer();
}

function doDelete() {
  if (!state.selected) return;
  pushUndo();
  removeObj(state.selected);
  state.selected = null;
  renderExplorer();
  renderProperties();
}

function doCopy() {
  if (!state.selected) return;
  var obj = findObj(state.selected);
  if (obj) { state.clipboard = deepClone(obj); notify('Copied', 'success'); }
}

function ctxCopy() { closeCtxMenu(); doCopy(); }
function ctxCut()  { closeCtxMenu(); doCopy(); doDelete(); }
function ctxInsert(){ closeCtxMenu(); openInsertDialog(); }
function ctxPaste() { closeCtxMenu(); doPaste(); }

function doPaste() {
  if (!state.clipboard) return;
  pushUndo();
  var copy = deepClone(state.clipboard);
  reassignIds(copy);
  insertObj(copy, state.selected);
  state.selected = copy.id;
  renderExplorer();
  renderProperties();
}

function reassignIds(obj) {
  obj.id = uid();
  for (var c of obj.children) reassignIds(c);
}

function doDuplicate() {
  if (!state.selected) return;
  doCopy();
  doPaste();
}

function groupSelected() {
  if (!state.selected) return;
  pushUndo();
  var obj = findObj(state.selected);
  var par = findParent(state.selected);
  var model = createObject('Model', par ? par.id : null);
  setPropVal(model,'Name','Model');
  var parList = par ? par.children : state.objects;
  var idx = parList.indexOf(obj);
  parList.splice(idx,1,model);
  model.children.push(obj);
  obj.parentId = model.id;
  state.selected = model.id;
  renderExplorer();
  renderProperties();
}

function ungroupSelected() {
  if (!state.selected) return;
  var obj = findObj(state.selected);
  if (!obj || !obj.children.length) return;
  pushUndo();
  var par = findParent(state.selected);
  var parList = par ? par.children : state.objects;
  var idx = parList.indexOf(obj);
  parList.splice(idx,1,...obj.children);
  state.selected = null;
  renderExplorer();
  renderProperties();
}

function selectAll() {
  if (state.objects.length) {
    state.selected = state.objects[0].id;
    renderExplorer();
    renderProperties();
  }
}

function renameSelected() {
  if (!state.selected) return;
  var row = document.querySelector('.tree-row.selected .tree-label');
  if (!row) return;
  var obj = findObj(state.selected);
  var oldName = getPropVal(obj,'Name') || '';
  var input = document.createElement('input');
  input.className = 'tree-label editing';
  input.value = oldName;
  row.replaceWith(input);
  input.focus();
  input.select();
  function commit() {
    var v = input.value.trim() || oldName;
    setPropVal(obj,'Name',v);
    renderExplorer();
    renderProperties();
  }
  input.onblur = commit;
  input.onkeydown = function(e) {
    if (e.key==='Enter') commit();
    if (e.key==='Escape') { input.value = oldName; commit(); }
  };
}

function selectTool(tool) {
  state.currentTool = tool;
  document.querySelectorAll('[id^=tool-]').forEach(b => b.classList.remove('active'));
  var btn = document.getElementById('tool-'+tool);
  if (btn) btn.classList.add('active');
}

function buildRbxmx(objects) {
  var lines = [];
  lines.push('<?xml version="1.0" encoding="utf-8"?>');
  lines.push('<roblox xmlns:xmime="http://www.w3.org/2005/05/xmlmime" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.roblox.com/roblox.xsd" version="4">');
  lines.push('  <External>null</External>');
  lines.push('  <External>nil</External>');
  function writeObj(o, indent) {
    var pad = ' '.repeat(indent);
    var name = getPropVal(o,'Name') || o.className;
    lines.push(pad+'<Item class="'+escXml(o.className)+'" referent="'+escXml(o.id)+'">');
    lines.push(pad+'  <Properties>');
    lines.push(pad+'    <string name="Name">'+escXml(name)+'</string>');
    for (var sec of o.propData) {
      for (var row of sec.rows) {
        if (row.name==='Name'||row.name==='ClassName') continue;
        var v = row.val;
        if (row.type==='boolean') {
          lines.push(pad+'    <bool name="'+escXml(row.name)+'">'+String(v)+'</bool>');
        } else if (row.type==='number') {
          lines.push(pad+'    <float name="'+escXml(row.name)+'">'+String(v)+'</float>');
        } else if (row.type==='color') {
          var r=parseInt(v.slice(1,3),16)/255, g=parseInt(v.slice(3,5),16)/255, b=parseInt(v.slice(5,7),16)/255;
          lines.push(pad+'    <Color3 name="'+escXml(row.name)+'">');
          lines.push(pad+'      <R>'+r.toFixed(6)+'</R>');
          lines.push(pad+'      <G>'+g.toFixed(6)+'</G>');
          lines.push(pad+'      <B>'+b.toFixed(6)+'</B>');
          lines.push(pad+'    </Color3>');
        } else if (row.type==='code') {
          lines.push(pad+'    <ProtectedString name="Source"><![CDATA['+String(v)+']]></ProtectedString>');
        } else if (row.type!=='readonly') {
          lines.push(pad+'    <string name="'+escXml(row.name)+'">'+escXml(String(v))+'</string>');
        }
      }
    }
    lines.push(pad+'  </Properties>');
    for (var c of o.children) writeObj(c, indent+2);
    lines.push(pad+'</Item>');
  }

  for (var o of objects) writeObj(o, 2);
  lines.push('</roblox>');
  return lines.join('\n');
}

function escXml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function openSettings() {
  closeDropdowns();
  var s = state.settings;
  document.getElementById('s-apikey').value = s.apiKey || '';
  document.getElementById('s-userid').value = s.userId || '';
  document.getElementById('s-univid').value = s.univId || '';
  document.getElementById('s-groupid').value = s.groupId || '';
  document.getElementById('s-groupunivid').value = s.groupUnivId || '';
  showModal('modal-settings');
}

function saveSettings() {
  state.settings = {
    apiKey:         document.getElementById('s-apikey').value.trim(),
    userId:         document.getElementById('s-userid').value.trim(),
    univId:         document.getElementById('s-univid').value.trim(),
    groupId:        document.getElementById('s-groupid').value.trim(),
    groupUnivId:    document.getElementById('s-groupunivid').value.trim(),
  };
  localStorage.setItem('rbx_settings', JSON.stringify(state.settings));
  closeModal();
  notify('Settings saved', 'success');
}

function loadSettings() {
  try {
    var s = localStorage.getItem('rbx_settings');
    if (s) state.settings = JSON.parse(s);
  } catch(e) {}
}

function openPublish() {
  closeDropdowns();
  if (!state.settings.apiKey) {
    notify('Set your API key in Settings first', 'error');
    openSettings();
    return;
  }
  document.getElementById('pub-name').value = 'Model';
  document.getElementById('pub-desc').value = '';
  document.getElementById('pub-status').style.display = 'none';
  document.getElementById('publish-result').style.display = 'none';
  selectPubTarget('user');
  showModal('modal-publish');
}

function selectPubTarget(t) {
  state.pubTarget = t;
  document.getElementById('pub-target-user').classList.toggle('selected', t==='user');
  document.getElementById('pub-target-group').classList.toggle('selected', t==='group');
}

async function doPublish() {
  var name = document.getElementById('pub-name').value.trim();
  var desc = document.getElementById('pub-desc').value.trim();
  var s = state.settings;

  if (!name) { notify('Enter a model name', 'error'); return; }
  if (!s.apiKey) { notify('Missing API key', 'error'); return; }

  var creatorId, isGroup;
  if (state.pubTarget === 'group') {
    if (!s.groupId) { notify('Group ID not set in Settings', 'error'); return; }
    creatorId = s.groupId; isGroup = true;
  } else {
    if (!s.userId) { notify('User ID not set in Settings', 'error'); return; }
    creatorId = s.userId; isGroup = false;
  }

  var btn = document.getElementById('pub-btn');
  btn.disabled = true;
  btn.textContent = 'Publishing...';

  var statusEl = document.getElementById('pub-status');
  statusEl.style.display = 'block';
  statusEl.textContent = 'Building internal structure...';

  var xml = buildRbxmx(state.objects);
  var blob = new Blob([xml], { type:'model/x-rbxm' });

  var creator = isGroup ? { groupId: creatorId } : { userId: creatorId };
  var payload = {
    assetType: 'Model',
    displayName: name,
    description: desc,
    creationContext: { creator: creator },
  };
  var fd = new FormData();
  fd.append('request', new Blob([JSON.stringify(payload)], { type:'application/json' }));
  fd.append('fileContent', blob, 'model.rbxmx');

  statusEl.textContent = 'Uploading to Roblox servers...';

  try {
    var res = await fetch('https://simplyieaf--ab7e1f3e3e6a11f1b2fa42b51c65c3df.web.val.run/assets/v1/assets', {
      method: 'POST',
      headers: { 'x-api-key': s.apiKey },
      body: fd,
    });
    var data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.errors?.[0]?.message || JSON.stringify(data));
    }
    var opPath = data.path;
    if (!opPath) throw new Error('No operation path returned');
    statusEl.textContent = 'Processing request...';
    var result = await pollOperation(opPath, s.apiKey, statusEl);
    var assetId = result?.response?.assetId || result?.response?.assetid;
    if (!assetId) throw new Error('No asset ID in response');
    var link = 'https://www.roblox.com/library/' + assetId;
    statusEl.style.display = 'none';
    var resEl = document.getElementById('publish-result');
    resEl.style.display = 'block';
    var linkEl = document.getElementById('pub-link');
    linkEl.textContent = link;
    linkEl.dataset.url = link;
    notify('Published successfully!', 'success');
  } catch(e) {
    statusEl.textContent = 'Error: ' + e.message;
    notify('Publish failed', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Publish';
  }
}

async function pollOperation(opPath, apiKey, statusEl) {
  var start = Date.now();
  while (Date.now()-start < 180000) {
    await new Promise(r => setTimeout(r, 4000));
    var r = await fetch('https://simplyieaf--ab7e1f3e3e6a11f1b2fa42b51c65c3df.web.val.run/assets/v1/' + opPath, {
      headers: { 'x-api-key': apiKey }
    });
    var d = await r.json();
    if (d.done) return d;
    statusEl.textContent = 'Finalizing...';
  }
  throw new Error('Operation timed out');
}

function showModal(id) {
  document.querySelectorAll('.modal').forEach(m=>m.style.display='none');
  document.getElementById(id).style.display='block';
  document.getElementById('modal-overlay').classList.add('visible');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('visible');
}

function showCtxMenu(x, y) {
  var m = document.getElementById('ctx-menu');
  m.style.left = x+'px'; m.style.top = y+'px';
  m.classList.add('visible');
}

function closeCtxMenu() {
  document.getElementById('ctx-menu').classList.remove('visible');
}

function notify(msg, type) {
  var el = document.getElementById('notif');
  el.textContent = msg;
  el.className = 'notif show' + (type ? ' '+type : '');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2200);
}

function closeDropdowns() {
  document.querySelectorAll('.dropdown').forEach(d=>d.classList.remove('visible'));
  document.querySelectorAll('.menu-item').forEach(m=>m.classList.remove('open'));
}

document.querySelectorAll('.menu-item').forEach(item => {
  item.addEventListener('click', function(e) {
    var dd = this.querySelector('.dropdown');
    var wasOpen = dd && dd.classList.contains('visible');
    closeDropdowns();
    if (dd && !wasOpen) {
      dd.classList.add('visible');
      this.classList.add('open');
    }
    e.stopPropagation();
  });
});

document.addEventListener('click', function(e) {
  closeDropdowns();
  closeCtxMenu();
});

document.addEventListener('keydown', function(e) {
  if (document.activeElement.tagName==='INPUT'||document.activeElement.tagName==='TEXTAREA') return;
  if (e.key==='Delete'||e.key==='Backspace') doDelete();
  if ((e.ctrlKey||e.metaKey) && e.key==='z') { e.preventDefault(); doUndo(); }
  if ((e.ctrlKey||e.metaKey) && e.key==='y') { e.preventDefault(); doRedo(); }
  if ((e.ctrlKey||e.metaKey) && e.key==='c') doCopy();
  if ((e.ctrlKey||e.metaKey) && e.key==='v') doPaste();
  if ((e.ctrlKey||e.metaKey) && e.key==='d') { e.preventDefault(); doDuplicate(); }
  if ((e.ctrlKey||e.metaKey) && e.key==='g') { e.preventDefault(); groupSelected(); }
  if ((e.ctrlKey||e.metaKey) && e.key==='i') { e.preventDefault(); openInsertDialog(); }
  if (e.key==='F2') renameSelected();
  if (e.key==='q'||e.key==='Q') selectTool('select');
  if (e.key==='w'||e.key==='W') selectTool('move');
  if (e.key==='e'||e.key==='E') selectTool('scale');
});

function initResizeHandle() {
  var handle = document.getElementById('resize-main');
  var explorer = document.getElementById('explorer');
  var dragging = false, startPos, startSize;

  handle.addEventListener('mousedown', function(e) {
    dragging = true;
    startPos = window.innerHeight > window.innerWidth ? e.clientY : e.clientX;
    startSize = window.innerHeight > window.innerWidth ? explorer.offsetHeight : explorer.offsetWidth;
    handle.classList.add('dragging'); 
    e.preventDefault();
  });

  document.addEventListener('mousemove', function(e) {
    if (!dragging) return;
    var isPortrait = window.innerHeight > window.innerWidth;
    var currentPos = isPortrait ? e.clientY : e.clientX;
    var delta = currentPos - startPos;
    
    if (isPortrait) {
      explorer.style.flex = 'none';
      explorer.style.width = '100%';
      explorer.style.height = Math.max(100, startSize + delta) + 'px';
    } else {
      explorer.style.flex = 'none';
      explorer.style.height = '100%';
      explorer.style.width = Math.max(150, startSize + delta) + 'px';
    }
  });

  document.addEventListener('mouseup', function() {
    if (dragging) { dragging = false; handle.classList.remove('dragging'); }
  });

  window.addEventListener('resize', function() {
    explorer.style.flex = '1';
    explorer.style.width = '';
    explorer.style.height = '';
  });
}

function init() {
  loadSettings();
  selectTool('select');
  renderExplorer();
  renderProperties();
  initResizeHandle();
}

window.addEventListener('DOMContentLoaded', init);

/**
 * Created by rafa on 1/26/19.
 */
export default function Entry() {}

Entry.clone = function (entry) {

  var newEntry = {
    created_at: entry.created_at,
    id: entry.id,
    name: entry.name,
    owner_id: entry.owner_id,
    parent_id: entry.parent_id,
    updated_at: entry.updated_at
  };

  if (entry.folder) {
    newEntry.folder = Entry.cloneFolder(entry.folder);
  }
  else {
    newEntry.source = Entry.cloneSource(entry.source);
  }

  return newEntry;
};

Entry.cloneFolder = function (folder) {
  var newFolder = {
    entry_id: folder.entry_id,
    inbox: folder.inbox,
    inbox_name: folder.inbox_name
  };

  return newFolder;
};

Entry.cloneSource = function (source) {
  var newSource = {
    entry_id: source.entry_id,
    type: source.type,
    context: source.context
  };

  return newSource;
};
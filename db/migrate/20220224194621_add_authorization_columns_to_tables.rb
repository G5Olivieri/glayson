class AddAuthorizationColumnsToTables < ActiveRecord::Migration[7.0]
  def change
    add_column :tasks, :can_show, :boolean, default: true
    add_column :tasks, :can_edit, :boolean, default: true
    add_column :tasks, :can_destroy, :boolean, default: true

    add_column :transactions, :can_show, :boolean, default: true
    add_column :transactions, :can_edit, :boolean, default: true
    add_column :transactions, :can_destroy, :boolean, default: true

    add_column :notes, :can_show, :boolean, default: true
    add_column :notes, :can_edit, :boolean, default: true
    add_column :notes, :can_destroy, :boolean, default: true
  end
end

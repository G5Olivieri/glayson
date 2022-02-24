class AddUserRefToTables < ActiveRecord::Migration[7.0]
  def change
    add_reference :tasks, :user, null: false, foreign_key: true, default: 1
    add_reference :transactions, :user, null: false, foreign_key: true, default: 1
    add_reference :notes, :user, null: false, foreign_key: true, default: 1
  end
end

class CreateRecurrings < ActiveRecord::Migration[7.0]
  def change
    create_table :recurrings do |t|
      t.date :start_date
      t.integer :limit
      t.integer :days, array: true, default: []
      t.references :transaction_promise, null: true, foreign_key: true

      t.timestamps
    end
  end
end

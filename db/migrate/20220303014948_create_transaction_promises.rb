class CreateTransactionPromises < ActiveRecord::Migration[7.0]
  def change
    create_table :transaction_promises do |t|
      t.string :name
      t.integer :amount
      t.string :transaction_type
      t.date :date
      t.references :transaction_promise, null: true, foreign_key: true

      t.timestamps
    end
  end
end

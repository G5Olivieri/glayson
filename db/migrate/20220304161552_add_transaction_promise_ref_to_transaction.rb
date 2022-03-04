class AddTransactionPromiseRefToTransaction < ActiveRecord::Migration[7.0]
  def change
    add_column :transactions, :transaction_type, :string, null: false, default: 'expense'
    add_reference :transactions, :transaction_promise, null: true, foreign_key: true
  end
end

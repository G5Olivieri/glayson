class TransactionPromise < ApplicationRecord
  belongs_to :transaction_promise, optional: true
  has_one :recurring, dependent: :destroy
end

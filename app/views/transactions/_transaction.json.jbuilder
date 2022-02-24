# frozen_string_literal: true

json.extract! transaction, :id, :name, :amount, :datetime, :description, :created_at, :updated_at
json.url transaction_url(transaction, format: :json)

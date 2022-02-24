# frozen_string_literal: true

class Transaction < ApplicationRecord
  validates :name, presence: true
  validates :amount, presence: true
  validates :datetime, presence: true

  belongs_to :user
end

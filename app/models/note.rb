# frozen_string_literal: true

class Note < ApplicationRecord
  has_rich_text :body

  validates :title, presence: true
  validates :body, presence: true

  belongs_to :user
end

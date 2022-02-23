# frozen_string_literal: true

class Note < ApplicationRecord
  has_rich_text :body
end

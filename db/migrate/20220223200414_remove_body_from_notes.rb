# frozen_string_literal: true

class RemoveBodyFromNotes < ActiveRecord::Migration[7.0]
  def change
    remove_column :notes, :body, :text
  end
end

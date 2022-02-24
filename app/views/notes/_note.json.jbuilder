# frozen_string_literal: true

json.extract! note, :id, :title, :body, :created_at, :updated_at
json.url user_url(note, format: :json)

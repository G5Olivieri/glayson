# frozen_string_literal: true

class ApplicationController < ActionController::Base
  helper_method :current_user

  def current_user
    @current_user
  end

  def set_current_user(user)
    @current_user = user
  end
end

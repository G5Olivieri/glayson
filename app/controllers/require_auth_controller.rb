# frozen_string_literal: true

class RequireAuthFilter
  def self.basic_authenticate(controller)
    user = ActionController::HttpAuthentication::Basic.authenticate(controller.request) do |given_name, given_password|
         user = User.find_by_username(given_name)
         return user if user && user.authenticate(given_password)
    end

    if user
      controller.send(:set_current_user, user)
    else
      ActionController::HttpAuthentication::Basic.authentication_request(controller, 'Application', nil)
    end
  end

  def self.session_authenticate(controller)
    session = controller.session
    if session[:user_id]
     controller.send(:set_current_user, User.find(session[:user_id]))
    else
      controller.redirect_to :login
    end
  end

  def self.before(controller)
    content_type = controller.request.headers['content-type']
    if content_type && content_type == 'application/json'
      RequireAuthFilter.basic_authenticate(controller)
    else
      RequireAuthFilter.session_authenticate(controller)
    end
  end
end

class RequireAuthController < ApplicationController
  before_action RequireAuthFilter
end

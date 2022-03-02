# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include Pundit::Authorization
  helper_method :current_user

  around_action :switch_locale

  def switch_locale(&action)
    locale = params[:locale] || I18n.default_locale
    I18n.with_locale(locale, &action)
  end

  def current_user
    @current_user
  end

  def set_current_user(user)
    @current_user = user
  end

  def default_url_options
      { locale: I18n.locale }
  end
end

# frozen_string_literal: true

class AdminPolicy < ApplicationPolicy
  %i(index? show? create? new? update? edit? destroy?).each do |method|
    define_method method do
      user.admin
    end
  end
end

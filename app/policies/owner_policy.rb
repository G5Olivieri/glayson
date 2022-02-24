# frozen_string_literal: true

class OwnerPolicy < ApplicationPolicy
  def show?
    record.user === user || record.can_show
  end

  def edit?
    record.user === user || record.can_edit
  end

  def update?
    record.user === user || record.can_edit
  end

  def destroy?
    record.user === user || record.can_destroy
  end

  def index?
    true
  end

  def create?
    true
  end

  def new?
    true
  end
end

# frozen_string_literal: true

class TransactionsController < ApplicationController
  def index
    @transactions = Transaction.all.group_by { |transaction| transaction.datetime.to_date }
  end

  def show
    @transaction = Transaction.find(params[:id])
  end

  def new
    @transaction = Transaction.new
  end

  def create
    @transaction = Transaction.new(transaction_params)
    if @transaction.save
      redirect_to @transaction
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    @transaction = Transaction.find(params[:id])
  end

  def update
    @transaction = Transaction.find(params[:id])
    if @transaction.update(transaction_params)
      redirect_to @transaction
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @transaction = Transaction.find(params[:id])
    @transaction.destroy
    redirect_to transactions_path, status: :see_other
  end

  private

  def transaction_params
    params.require(:transaction).permit(:name, :description, :amount, :datetime)
  end
end

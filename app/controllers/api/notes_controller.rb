# frozen_string_literal: true

module Api
  class NotesController < ApplicationController
    def index
      @notes = Note.all
      render json: @notes
    end

    def show
      @note = Note.find(params[:id])
      render json: @note
    end

    def create
      @note = Note.new(note_params)
      if @note.save
        redirect_to @note
      else
        render status: :unprocessable_entity
      end
    end

    def update
      @note = Note.find(params[:id])
      if @note.update(note_params)
        redirect_to @note
      else
        render status: :unprocessable_entity
      end
    end

    def destroy
      @note = Note.find(params[:id])
      @note.destroy
      render status: :no_content
    end

    private

    def note_params
      params.require(:note).permit(:title, :body)
    end
  end
end
